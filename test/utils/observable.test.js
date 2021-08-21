import Observable from "../../src/game/utils/observable";

describe('Observable', () => {

  describe('Observable class', () => {

    it('should get the DATA_EXAMPLE emitted by the observable', (done) => {
      const DATA_EXAMPLE = "example info emitted";
      const observable = new Observable();

      observable.on((data) => {
        expect(data).toEqual(DATA_EXAMPLE);
        done();
      });

      observable.emit(DATA_EXAMPLE);
    });

  });
});
