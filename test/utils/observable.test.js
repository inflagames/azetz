import Observable, {
  filterObservable,
  mapObservable, takeUntil,
} from "../../src/game/utils/observable";

describe("Observable", () => {
  describe("Observable class", () => {
    it("should get the DATA_EXAMPLE emitted by the observable", () => {
      const DATA_EXAMPLE = "example info emitted";
      const observable = new Observable();

      observable.on((data) => {
        expect(data).toEqual(DATA_EXAMPLE);
        Promise.resolve();
      });

      observable.emit(DATA_EXAMPLE);
    });
  });

  describe("Observable filter", () => {
    it("should filter the observable by even numbers", () => {
      const funct = jest.fn();

      const observable = new Observable();

      observable.pipe(filterObservable((num) => num % 2 === 0)).on(funct);

      observable.emit(2);
      observable.emit(4);
      observable.emit(1);
      observable.emit(3);

      expect(funct).toHaveBeenCalledTimes(2);
    });

    it("should filter the observable by even numbers and greater than 3 (multiples pipes)", () => {
      const funct = jest.fn();

      const observable = new Observable();

      observable
        .pipe(
          filterObservable((num) => num % 2 === 0),
          filterObservable((num) => num > 3)
        )
        .on(funct);

      observable.emit(2);
      observable.emit(4);
      observable.emit(1);
      observable.emit(3);

      expect(funct).toHaveBeenCalledTimes(1);
    });
  });

  describe("Observable map", () => {
    it("should map the observable with a sum operation", () => {
      const observable = new Observable();

      observable.pipe(mapObservable((value) => value + 4)).on((result) => {
        expect(result).toEqual(8);
        Promise.resolve();
      });

      observable.emit(4);
    });
  });

  describe('Observable takeUntil', function () {
    it('should cut the stream after takeUntil is emitted', function () {
      const unsub = new Observable();
      const obs = new Observable();

      const functionToCall = jest.fn();

      const obsResult = obs.pipe(takeUntil(unsub));
      obsResult.on(() => {functionToCall()});
      expect(unsub.subscriptions).toHaveLength(1);

      unsub.emit();
      expect(unsub.subscriptions).toHaveLength(0);

      obs.emit()
      expect(obsResult.subscriptions).toHaveLength(0);
      expect(functionToCall).toHaveBeenCalledTimes(0);
    });
  });
});
