declare var require: any;
import { DocumentNode, SelectionSetNode, DefinitionNode } from 'graphql';

import { GqlScriptsList } from './gql.config';

interface GqlDefinitionCache {
  definition: DefinitionNode;
  fragments: Array<string>;
}

interface GqlDefinitionCacheNode {
  [index: string]: GqlDefinitionCache;
}

interface GqlDocNode {
  [index: string]: DocumentNode;
}

class GqlDocumentManager {
  private static instance: GqlDocumentManager;

  private constructor(
    private gqlOperationsCache: GqlDefinitionCacheNode = {},
    private gqlFragmentsCache: GqlDefinitionCacheNode = {},
    private gqlDocumentsCache: GqlDocNode = {}
  ) {
    this.initLoader();
  }

  static getInstance() {
    if (!GqlDocumentManager.instance) {
      GqlDocumentManager.instance = new GqlDocumentManager();
    }
    return GqlDocumentManager.instance;
  }

  private initLoader(): void {
    if (Object.keys(this.gqlDocumentsCache).length === 0) {
      this.loadScripts();
      this.gqlOperationsCache = {};
      this.gqlFragmentsCache = {};
    }
    this.loadScripts();
  }

  /**
   * Prunes duplicate Definitions. First seen wins.
   * @param definitions Array of DefinitionNode
   */
  private processDuplicateDefinitions(
    definitions: Array<DefinitionNode>
  ): Array<DefinitionNode> {
    const processedFragments: { [index: string]: boolean } = {};
    definitions = definitions.filter((def) => {
      let keep = false;
      switch (def.kind) {
        case 'FragmentDefinition':
        case 'OperationDefinition':
          const key = `${def.kind}-${def.name.value}`;
          if (!processedFragments.hasOwnProperty(key)) {
            keep = true;
            processedFragments[key] = keep;
          }
      }
      return keep;
    });
    return definitions;
  }

  /**
   * Processes Fragment Definitions
   * @param item
   * @param definitions
   */
  private processFragmentDefinitions(
    item: GqlDefinitionCache,
    definitions: Array<DefinitionNode> = []
  ): Array<DefinitionNode> {
    definitions.push(item.definition);
    for (const fragment of item.fragments) {
      if (this.gqlFragmentsCache.hasOwnProperty(fragment)) {
        const cache = this.gqlFragmentsCache[fragment];
        this.processFragmentDefinitions(cache, definitions);
      }
    }
    return definitions;
  }

  private getFragmentNames(
    docSet: SelectionSetNode,
    fragments: Array<string> = []
  ): Array<string> {
    if (docSet && docSet.selections) {
      for (const selection of docSet.selections) {
        if (selection.kind === 'FragmentSpread') {
          if (selection.name.kind === 'Name' && selection.name.value) {
            fragments.push(selection.name.value);
          }
        } else if (selection && selection.selectionSet) {
          fragments.concat(
            this.getFragmentNames(selection.selectionSet, fragments)
          );
        }
      }
    }
    return fragments;
  }

  private loadDefinitions(doc: DocumentNode): void {
    for (const definition of doc.definitions) {
      switch (definition.kind) {
        case 'OperationDefinition':
          if (this.gqlOperationsCache.hasOwnProperty(definition.name.value)) {
            throw new Error(
              `Multiple copies of ${definition.name.value} operation was found.`
            );
          }
          this.gqlOperationsCache[definition.name.value] = {
            definition: definition,
            fragments: this.getFragmentNames(definition.selectionSet),
          };
          break;
        case 'FragmentDefinition':
          if (this.gqlFragmentsCache.hasOwnProperty(definition.name.value)) {
            throw new Error(
              `Multiple copies of ${definition.name.value} fragment was found.`
            );
          }
          this.gqlFragmentsCache[definition.name.value] = {
            definition: definition,
            fragments: this.getFragmentNames(definition.selectionSet),
          };
          break;
      }
    }
  }

  private loadDocuments() {
    for (const name in this.gqlOperationsCache) {
      if (this.gqlOperationsCache.hasOwnProperty(name)) {
        const cache = this.gqlOperationsCache[name];
        const definitions = this.processFragmentDefinitions(cache);
        this.gqlDocumentsCache[name] = <DocumentNode>{
          kind: 'Document',
          definitions: this.processDuplicateDefinitions(definitions),
        };
      }
    }
  }

  private loadScripts(): void {
    const gqlScriptLoader = require.context(
      'graphql-tag/loader!',
      true,
      /\.gql$/
    );
    for (const script of GqlScriptsList) {
      const doc = gqlScriptLoader(script);
      this.loadDefinitions(doc);
    }
    this.loadDocuments();
  }

  getOperation(name: string): DocumentNode {
    if (this.gqlDocumentsCache.hasOwnProperty(name)) {
      return this.gqlDocumentsCache[name];
    }
    throw new Error(`GQL operation document not found (${name}).`);
  }
}

export const gqlMgr = GqlDocumentManager.getInstance();
