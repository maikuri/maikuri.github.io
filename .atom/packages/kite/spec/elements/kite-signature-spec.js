'use strict';

const KiteSignature = require('../../lib/elements/kite-signature');
const {click} = require('../helpers/events');

describe('KiteSignature', () => {
  let json, element;

  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('language-python'));
  });

  describe('with python data', () => {
    beforeEach(() => {
      json = require('../fixtures/dumps-signature.json');
      element = new KiteSignature();
      element.setData(json);
    });

    it('fills the name section with provided data', () => {
      expect(element.querySelector('.name').textContent)
      // \u200b = zero-width space
      .toEqual(`json.dumps(\u200b${
        [
          'obj',
          'skipkeys',
          'ensure_ascii',
          'check_circular',
          'allow_nan',
          'cls',
          'indent',
          'separators',
          'encoding',
          'default',
          'sort_keys',
          '**kw',
        ].join(', ')
      })`);
    });

    it('highlights the argument at arg_index', () => {
      expect(element.querySelector('.name .parameter-highlight')).toExist();
      expect(element.querySelector('.name .parameter-highlight').textContent).toEqual('obj, ');
    });

    it('creates a kwargs section', () => {
      expect(element.querySelector('section.kwargs')).toExist();
      expect(element.querySelectorAll('section.kwargs dt').length).toEqual(29);
    });

    describe('render', () => {
      beforeEach(() => {
        element.setData(json);
      });

      it('creates a popular patterns section', () => {
        expect(element.querySelector('.patterns')).toExist();
        expect(element.querySelector('.patterns pre')).toExist();
      });

      describe('clicking on the kwargs link in the signature', () => {
        beforeEach(() => {
          click(element.querySelector('a.kwargs'));
        });

        it('expand the kwargs section', () => {
          expect(element.querySelector('section.kwargs').classList.contains('visible')).toBeTruthy();
        });
      });

      describe('when the arg_index is in_kwargs', () => {
        beforeEach(() => {
          json.calls[0].language_details.Python.in_kwargs = true;
          element.setData(json);
        });

        it('does not highlight an argument in the signature', () => {
          expect(element.querySelector('.name .parameter-highlight')).not.toExist();
        });

        it('expand the kwargs section', () => {
          expect(element.querySelector('section.kwargs').classList.contains('visible')).toBeTruthy();
        });
      });
    });
  });

  describe('with javascript data', () => {
    beforeEach(() => {
      json = require('../fixtures/stringify-signature-js.json');
      element = new KiteSignature();
      element.setData(json);
    });

    it('fills the name section with provided data', () => {
      expect(element.querySelector('.name').textContent)
      // \u200b = zero-width space
      .toEqual(`JSON.stringify(\u200b${
        [
          'value',
          'replacer',
          'space',
        ].join(', ')
      })`);
    });

    it('does not create a kwargs section', () => {
      expect(element.querySelector('section.kwargs')).not.toExist();
    });

    describe('with a function with a rest argument', () => {
      beforeEach(() => {
        json = require('../fixtures/stringify-signature-with-rest-js.json');
        element = new KiteSignature();
        element.setData(json);
      });

      it('renders the rest argument in the signature', () => {
        expect(element.querySelector('.name').textContent)
        // \u200b = zero-width space
        .toEqual(`JSON.stringify(\u200b${
          [
            'value',
            'replacer',
            'space',
            '???opts',
          ].join(', ')
        })`);
      });
    });
  });
});
