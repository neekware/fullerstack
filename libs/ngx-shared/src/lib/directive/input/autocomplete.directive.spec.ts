import { AutocompleteDirective, FormAutocompleteDirective } from './autocomplete.directive';

describe('AutocompleteDirective', () => {
  it('should create an instance', () => {
    const directive = new AutocompleteDirective('off');
    expect(directive).toBeTruthy();
  });

  it('should create an instance', () => {
    const directive = new FormAutocompleteDirective('off');
    expect(directive).toBeTruthy();
  });
});
