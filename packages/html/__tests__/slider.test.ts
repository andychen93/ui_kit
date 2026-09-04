import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Slider, createSlider } from '../src/components/slider';

/**
 * jsdom does not perform real layout, so getBoundingClientRect() on the
 * track always reports zeros. Stub it with a realistic rect so drag /
 * click-to-seek math (which divides by rect.width) behaves like a real
 * browser.
 */
function stubTrackRect(track: HTMLElement, left: number, width: number): void {
  vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
    left,
    width,
    top: 0,
    height: 10,
    right: left + width,
    bottom: 10,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

function getTrack(slider: Slider): HTMLElement {
  return slider.getElement().querySelector('.ag-slider-track') as HTMLElement;
}

function getThumbs(slider: Slider): HTMLElement[] {
  return Array.from(slider.getElement().querySelectorAll('.ag-slider-thumb'));
}

function getInputs(slider: Slider): HTMLInputElement[] {
  return Array.from(slider.getElement().querySelectorAll('.ag-slider-input'));
}

describe('Slider Component', () => {
  let container: HTMLDivElement;
  let rootEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    rootEl = document.createElement('div');
    container.appendChild(rootEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const slider = new Slider(rootEl);
      expect(slider.getElement()).toBe(rootEl);
    });

    it('should initialize with selector string', () => {
      rootEl.id = 'test-slider';
      const slider = new Slider('#test-slider');
      expect(slider.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new Slider('#missing-slider')).toThrow(
        'Element not found for selector: #missing-slider'
      );
    });
  });

  describe('initial render - single value mode', () => {
    it('should build one thumb/input and reflect the initial value', () => {
      const slider = new Slider(rootEl, { value: 30 });
      const thumbs = getThumbs(slider);
      const inputs = getInputs(slider);

      expect(thumbs).toHaveLength(1);
      expect(inputs).toHaveLength(1);
      expect(inputs[0].value).toBe('30');
      expect(thumbs[0].style.left).toBe('30%');
    });

    it('should default to min (0) when no value is given', () => {
      const slider = new Slider(rootEl);
      expect(slider.getValue()).toBe(0);
    });

    it('should fill the track from 0 to the value percent', () => {
      const slider = new Slider(rootEl, { value: 40 });
      const filled = slider.getElement().querySelector('.ag-slider-track-filled') as HTMLElement;
      expect(filled.style.left).toBe('0%');
      expect(filled.style.width).toBe('40%');
    });

    it('should apply disabled class and omit thumb tabindex when disabled', () => {
      const slider = new Slider(rootEl, { disabled: true });
      expect(slider.getElement().className).toContain('ag-slider--disabled');
      const thumbs = getThumbs(slider);
      expect(thumbs[0].hasAttribute('tabindex')).toBe(false);
    });

    it('should set tabindex=0 on the thumb when not disabled', () => {
      const slider = new Slider(rootEl);
      const thumbs = getThumbs(slider);
      expect(thumbs[0].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('initial render - range mode', () => {
    it('should build two thumbs/inputs reflecting the rangeValue tuple', () => {
      const slider = new Slider(rootEl, { range: true, rangeValue: [20, 80] });
      const thumbs = getThumbs(slider);
      const inputs = getInputs(slider);

      expect(thumbs).toHaveLength(2);
      expect(inputs).toHaveLength(2);
      expect(inputs[0].value).toBe('20');
      expect(inputs[1].value).toBe('80');
      expect(thumbs[0].style.left).toBe('20%');
      expect(thumbs[1].style.left).toBe('80%');
    });

    it('should default rangeValue to [min, max] when not provided', () => {
      const slider = new Slider(rootEl, { range: true, min: 0, max: 100 });
      expect(slider.getValue()).toEqual([0, 100]);
    });

    it('should fill the track between the two handle percents', () => {
      const slider = new Slider(rootEl, { range: true, rangeValue: [30, 70] });
      const filled = slider.getElement().querySelector('.ag-slider-track-filled') as HTMLElement;
      expect(filled.style.left).toBe('30%');
      expect(filled.style.width).toBe('40%');
    });
  });

  describe('getValue / setValue - single mode', () => {
    it('should clamp values above max down to max', () => {
      const slider = new Slider(rootEl, { min: 0, max: 100 });
      slider.setValue(500);
      expect(slider.getValue()).toBe(100);
    });

    it('should clamp values below min up to min', () => {
      const slider = new Slider(rootEl, { min: 0, max: 100 });
      slider.setValue(-50);
      expect(slider.getValue()).toBe(0);
    });

    it('should snap values to the nearest step', () => {
      const slider = new Slider(rootEl, { min: 0, max: 100, step: 10 });
      slider.setValue(23);
      expect(slider.getValue()).toBe(20);
    });

    it('should update the thumb position and hidden input on setValue', () => {
      const slider = new Slider(rootEl, { min: 0, max: 100 });
      slider.setValue(65);
      const thumbs = getThumbs(slider);
      const inputs = getInputs(slider);
      expect(thumbs[0].style.left).toBe('65%');
      expect(inputs[0].value).toBe('65');
    });

    it('should be a no-op when disabled', () => {
      const slider = new Slider(rootEl, { disabled: true, value: 10 });
      slider.setValue(90);
      expect(slider.getValue()).toBe(10);
    });
  });

  describe('getValue / setValue - range mode', () => {
    it('should set both handles from a full [start, end] tuple', () => {
      const slider = new Slider(rootEl, { range: true, rangeValue: [10, 20] });
      slider.setValue([15, 85]);
      expect(slider.getValue()).toEqual([15, 85]);
    });

    it('should clamp each side of the tuple independently', () => {
      const slider = new Slider(rootEl, { range: true, min: 0, max: 100 });
      slider.setValue([-20, 500]);
      expect(slider.getValue()).toEqual([0, 100]);
    });

    it('should ignore a plain number in range mode', () => {
      const slider = new Slider(rootEl, { range: true, rangeValue: [10, 20] });
      slider.setValue(50);
      expect(slider.getValue()).toEqual([10, 20]);
    });

    it('should be a no-op when disabled', () => {
      const slider = new Slider(rootEl, { range: true, disabled: true, rangeValue: [10, 20] });
      slider.setValue([50, 60]);
      expect(slider.getValue()).toEqual([10, 20]);
    });
  });

  describe('drag behavior - single mode', () => {
    it('should update the value while dragging and fire onChange with a number on mouseup', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, { min: 0, max: 100, onChange });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);
      const thumb = getThumbs(slider)[0];

      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));

      // Still dragging: value already reflects the drag position, onChange not yet fired.
      expect(slider.getValue()).toBe(50);
      expect(onChange).not.toHaveBeenCalled();

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(50);
      expect(typeof onChange.mock.calls[0][0]).toBe('number');
    });

    it('should not start a drag when disabled', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, { disabled: true, min: 0, max: 100, onChange });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);
      const thumb = getThumbs(slider)[0];

      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(onChange).not.toHaveBeenCalled();
      expect(slider.getValue()).toBe(0);
    });
  });

  describe('click-to-seek behavior - single mode', () => {
    it('should jump the value to the clicked position and fire onChange with a number', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, { min: 0, max: 100, onChange });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);

      track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 150 }));

      expect(slider.getValue()).toBe(75);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(75);
    });

    it('should not seek when disabled', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, { disabled: true, min: 0, max: 100, onChange });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);

      track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 150 }));

      expect(onChange).not.toHaveBeenCalled();
      expect(slider.getValue()).toBe(0);
    });
  });

  describe('drag behavior - range mode', () => {
    it('should drag the second handle independently and emit a full tuple on mouseup', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, {
        range: true,
        min: 0,
        max: 100,
        rangeValue: [20, 80],
        onChange,
      });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);
      const thumbs = getThumbs(slider);

      thumbs[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 180 })); // 90%
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(onChange).toHaveBeenCalledTimes(1);
      const value = onChange.mock.calls[0][0];
      expect(Array.isArray(value)).toBe(true);
      expect(value).toEqual([20, 90]);
      expect(typeof value[0]).toBe('number');
      expect(typeof value[1]).toBe('number');
    });

    it('should drag the first handle without disturbing the second', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, {
        range: true,
        min: 0,
        max: 100,
        rangeValue: [20, 80],
        onChange,
      });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);
      const thumbs = getThumbs(slider);

      thumbs[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 20 })); // 10%
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(onChange).toHaveBeenCalledWith([10, 80]);
    });
  });

  describe('click-to-seek behavior - range mode', () => {
    it('should move the nearest handle to the clicked position', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, {
        range: true,
        min: 0,
        max: 100,
        rangeValue: [20, 80],
        onChange,
      });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);

      // clientX 170 -> 85%, closer to 80 (handle 1) than to 20 (handle 0)
      track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 170 }));

      const value = onChange.mock.calls[0][0];
      expect(value).toEqual([20, 85]);
    });

    it('never emits a partial or undefined tuple element', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, {
        range: true,
        min: 0,
        max: 100,
        rangeValue: [20, 80],
        onChange,
      });
      const track = getTrack(slider);
      stubTrackRect(track, 0, 200);

      track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 10 }));

      const value = onChange.mock.calls[0][0];
      expect(value).toHaveLength(2);
      expect(value[0]).not.toBeUndefined();
      expect(value[1]).not.toBeUndefined();
    });
  });

  describe('setDisabled / isDisabled', () => {
    it('should toggle disabled class and tabindex on thumbs', () => {
      const slider = new Slider(rootEl);
      expect(slider.isDisabled()).toBe(false);

      slider.setDisabled(true);

      expect(slider.isDisabled()).toBe(true);
      expect(slider.getElement().className).toContain('ag-slider--disabled');
      const thumbs = getThumbs(slider);
      expect(thumbs[0].hasAttribute('tabindex')).toBe(false);

      slider.setDisabled(false);
      expect(getThumbs(slider)[0].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('destroy', () => {
    it('should remove thumbs, inputs and the track element from the DOM', () => {
      const slider = new Slider(rootEl, { value: 10 });
      expect(getThumbs(slider)).toHaveLength(1);
      expect(getTrack(slider)).not.toBeNull();

      slider.destroy();

      expect(rootEl.querySelectorAll('.ag-slider-thumb')).toHaveLength(0);
      expect(rootEl.querySelectorAll('.ag-slider-input')).toHaveLength(0);
      expect(rootEl.querySelector('.ag-slider-track')).toBeNull();
    });

    it('should stop firing onChange after destroy even if a detached thumb dispatches events', () => {
      const onChange = vi.fn();
      const slider = new Slider(rootEl, { min: 0, max: 100, onChange });
      const thumb = getThumbs(slider)[0];

      slider.destroy();

      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createSlider', () => {
    it('should create a slider element from scratch reflecting options', () => {
      const slider = createSlider({ value: 33, min: 0, max: 100 });
      expect(slider.getElement().className).toContain('ag-slider');
      expect(slider.getValue()).toBe(33);
    });

    it('should support range mode via the factory', () => {
      const slider = createSlider({ range: true, rangeValue: [5, 95] });
      expect(slider.getValue()).toEqual([5, 95]);
    });
  });
});
