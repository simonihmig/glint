import { GlintEnvironment } from '../src';

describe('Environments', () => {
  describe('template tags config', () => {
    test('locating a single tag', () => {
      let env = new GlintEnvironment('test-env', {
        tags: {
          'my-cool-environment': { hbs: { typesSource: 'whatever' } },
        },
      });

      expect(env.moduleMayHaveTagImports('import foo from "my-cool-environment"\n')).toBe(true);
    });

    test('locating one of several tags', () => {
      let env = new GlintEnvironment('test-env', {
        tags: {
          'my-cool-environment': { hbs: { typesSource: 'whatever' } },
          'another-env': { tagMe: { typesSource: 'over-here' } },
          'and-this-one': { hbs: { typesSource: '✨' } },
        },
      });

      expect(env.moduleMayHaveTagImports('import foo from "another-env"\n')).toBe(true);
    });

    test('checking a module with no tags in use', () => {
      let env = new GlintEnvironment('test-env', {
        tags: {
          'my-cool-environment': { hbs: { typesSource: 'whatever' } },
        },
      });

      expect(env.moduleMayHaveTagImports('import { hbs } from "another-env"\n')).toBe(false);
    });

    test('getting specified template tag config', () => {
      let tags = {
        '@glimmerx/component': { hbs: { typesSource: '@glint/environment-glimmerx/types' } },
      };

      let env = new GlintEnvironment('test-env', { tags });

      expect(env.getConfiguredTemplateTags()).toBe(tags);
    });
  });

  describe('standalone template config', () => {
    test('no standalone template support', () => {
      let env = new GlintEnvironment('test-env', {});

      expect(env.getTypesForStandaloneTemplate()).toBeUndefined();
      expect(env.getPossibleScriptPaths('hello.hbs')).toEqual([]);
      expect(env.getPossibleTemplatePaths('hello.ts')).toEqual([]);
    });

    test('reflecting specified configuration', () => {
      let env = new GlintEnvironment('test-env', {
        template: {
          typesPath: '@glint/test-env/types',
          getPossibleTemplatePaths: (script) => [script.replace('.ts', '.hbs')],
          getPossibleScriptPaths: (template) => [
            template.replace('.hbs', '.ts'),
            template.replace('.hbs', '.js'),
          ],
        },
      });

      expect(env.getTypesForStandaloneTemplate()).toEqual('@glint/test-env/types');
      expect(env.getPossibleTemplatePaths('hello.ts')).toEqual(['hello.hbs']);
      expect(env.getPossibleScriptPaths('hello.hbs')).toEqual(['hello.ts', 'hello.js']);
    });
  });
});
