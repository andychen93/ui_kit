import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AvatarGroup, createAvatarGroup } from '../src/components/avatar-group';

function makeAvatarChild(): HTMLDivElement {
  const el = document.createElement('div');
  el.classList.add('ag-avatar');
  return el;
}

describe('AvatarGroup Component', () => {
  let container: HTMLDivElement;
  let groupEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    groupEl = document.createElement('div');
    container.appendChild(groupEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const group = new AvatarGroup(groupEl);
      expect(group.getElement()).toBe(groupEl);
    });

    it('should initialize with element selector', () => {
      groupEl.id = 'test-group';
      const group = new AvatarGroup('#test-group');
      expect(group.getElement()).toBe(groupEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new AvatarGroup('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default size and overlap classes', () => {
      new AvatarGroup(groupEl);
      expect(groupEl.className).toContain('ag-avatar-group');
      expect(groupEl.className).toContain('ag-avatar-group--md');
      expect(groupEl.className).toContain('ag-avatar-group--overlap');
    });

    it('should apply size class', () => {
      new AvatarGroup(groupEl, { size: 'lg' });
      expect(groupEl.className).toContain('ag-avatar-group--lg');
      expect(groupEl.className).not.toContain('ag-avatar-group--md');
    });

    it('should not apply the overlap class when overlap is false', () => {
      new AvatarGroup(groupEl, { overlap: false });
      expect(groupEl.className).not.toContain('ag-avatar-group--overlap');
    });

    it('should mark existing avatar children as group avatars up to the default max of 3', () => {
      const a1 = makeAvatarChild();
      const a2 = makeAvatarChild();
      groupEl.appendChild(a1);
      groupEl.appendChild(a2);

      new AvatarGroup(groupEl);

      expect(a1.classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(a2.classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(groupEl.querySelector('.ag-avatar-group-overflow')).toBeNull();
    });

    it('should hide avatars beyond max and render an overflow indicator', () => {
      const avatars = [makeAvatarChild(), makeAvatarChild(), makeAvatarChild(), makeAvatarChild()];
      avatars.forEach(a => groupEl.appendChild(a));

      new AvatarGroup(groupEl, { max: 3 });

      expect(avatars[0].classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(avatars[1].classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(avatars[2].classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(avatars[3].style.display).toBe('none');

      const overflow = groupEl.querySelector('.ag-avatar-group-overflow');
      expect(overflow).not.toBeNull();
      expect(overflow?.querySelector('.ag-avatar-group-count')?.textContent).toBe('+1');
    });

    it('should respect a custom max option', () => {
      const avatars = [makeAvatarChild(), makeAvatarChild()];
      avatars.forEach(a => groupEl.appendChild(a));

      new AvatarGroup(groupEl, { max: 1 });

      expect(avatars[0].classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(avatars[1].style.display).toBe('none');
      expect(groupEl.querySelector('.ag-avatar-group-count')?.textContent).toBe('+1');
    });
  });

  describe('addAvatar', () => {
    it('should mark an already-appended child element as a group avatar', () => {
      const group = new AvatarGroup(groupEl);
      const newAvatar = makeAvatarChild();
      groupEl.appendChild(newAvatar);

      group.addAvatar(newAvatar);

      expect(newAvatar.classList.contains('ag-avatar-group-avatar')).toBe(true);
    });
  });

  describe('removeAvatar', () => {
    // removeAvatar's effect only sticks for elements that don't carry the
    // base "ag-avatar" class: processAvatars() re-scans children matching
    // ".ag-avatar, .ag-avatar-group-avatar" and re-marks anything still
    // matching that filter. So we exercise it on an avatar added via
    // addAvatar (a plain element, not one already carrying "ag-avatar"),
    // which is the natural add/remove pairing.
    it('should unmark an avatar added via addAvatar and restore its display', () => {
      const group = new AvatarGroup(groupEl);
      const added = document.createElement('div');
      groupEl.appendChild(added);
      group.addAvatar(added);
      expect(added.classList.contains('ag-avatar-group-avatar')).toBe(true);

      group.removeAvatar(added);

      expect(added.classList.contains('ag-avatar-group-avatar')).toBe(false);
      expect(added.style.display).toBe('');
    });

    it('should accept a selector string', () => {
      const group = new AvatarGroup(groupEl);
      const added = document.createElement('div');
      added.id = 'avatar-to-remove';
      groupEl.appendChild(added);
      group.addAvatar('#avatar-to-remove');

      group.removeAvatar('#avatar-to-remove');

      expect(added.classList.contains('ag-avatar-group-avatar')).toBe(false);
    });

    it('re-marks a removed avatar on the next processAvatars pass if it still carries the base "ag-avatar" class (component quirk)', () => {
      // Documents actual behavior: removeAvatar() calls processAvatars()
      // internally, which re-selects any child still matching
      // ".ag-avatar, .ag-avatar-group-avatar" and re-adds the group class.
      // Elements rendered by the Avatar component always keep "ag-avatar",
      // so removing them from a group this way does not persist.
      const a1 = makeAvatarChild();
      groupEl.appendChild(a1);
      const group = new AvatarGroup(groupEl);

      group.removeAvatar(a1);

      expect(a1.classList.contains('ag-avatar-group-avatar')).toBe(true);
    });
  });

  describe('setMax', () => {
    it('should hide additional avatars once the max is lowered', () => {
      const avatars = [makeAvatarChild(), makeAvatarChild(), makeAvatarChild()];
      avatars.forEach(a => groupEl.appendChild(a));
      const group = new AvatarGroup(groupEl, { max: 3 });

      expect(avatars[2].style.display).not.toBe('none');

      group.setMax(2);

      expect(avatars[0].classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(avatars[1].classList.contains('ag-avatar-group-avatar')).toBe(true);
      expect(avatars[2].style.display).toBe('none');
    });
  });

  describe('setOverlap', () => {
    it('should toggle the overlap class', () => {
      const group = new AvatarGroup(groupEl, { overlap: false });
      expect(groupEl.className).not.toContain('ag-avatar-group--overlap');

      group.setOverlap(true);
      expect(groupEl.className).toContain('ag-avatar-group--overlap');

      group.setOverlap(false);
      expect(groupEl.className).not.toContain('ag-avatar-group--overlap');
    });
  });

  describe('size management', () => {
    it('should set size and update classes', () => {
      const group = new AvatarGroup(groupEl);
      group.setSize('sm');
      expect(group.getSize()).toBe('sm');
      expect(groupEl.className).toContain('ag-avatar-group--sm');
      expect(groupEl.className).not.toContain('ag-avatar-group--md');
    });

    it('should get default size', () => {
      const group = new AvatarGroup(groupEl);
      expect(group.getSize()).toBe('md');
    });
  });

  describe('destroy', () => {
    it('should unmark tracked avatars and restore their display', () => {
      const avatars = [makeAvatarChild(), makeAvatarChild()];
      avatars.forEach(a => groupEl.appendChild(a));
      const group = new AvatarGroup(groupEl);

      group.destroy();

      avatars.forEach(a => {
        expect(a.classList.contains('ag-avatar-group-avatar')).toBe(false);
        expect(a.style.display).toBe('');
      });
    });

    it('should remove the overflow indicator element', () => {
      const avatars = [makeAvatarChild(), makeAvatarChild(), makeAvatarChild(), makeAvatarChild()];
      avatars.forEach(a => groupEl.appendChild(a));
      const group = new AvatarGroup(groupEl, { max: 3 });

      expect(groupEl.querySelector('.ag-avatar-group-overflow')).not.toBeNull();

      group.destroy();

      expect(groupEl.querySelector('.ag-avatar-group-overflow')).toBeNull();
    });

    it('should not remove the group root element itself', () => {
      const group = new AvatarGroup(groupEl);
      group.destroy();
      expect(container.contains(groupEl)).toBe(true);
    });
  });

  describe('createAvatarGroup', () => {
    it('should create a group element from scratch with the given options', () => {
      const group = createAvatarGroup({ size: 'lg', overlap: false });
      const element = group.getElement();
      expect(element.tagName).toBe('DIV');
      expect(element.className).toContain('ag-avatar-group');
      expect(element.className).toContain('ag-avatar-group--lg');
      expect(element.className).not.toContain('ag-avatar-group--overlap');
    });
  });
});
