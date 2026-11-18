// 슬롯 선택값으로 프롬프트 문장을 조립한다. 브라우저와 Node 양쪽에서 쓴다.
(function (root) {
  function fill(template, subject) {
    return template.replace(/\{(\w+)\}/g, (_, key) => subject[key]);
  }

  function byId(list, id) {
    const item = list.find((x) => x.id === id);
    if (!item) throw new Error('unknown id: ' + id);
    return item;
  }

  // 직접 입력한 문구는 끝의 마침표를 떼고 쓴다.
  function clean(text) {
    return String(text).trim().replace(/[.。]+$/, '');
  }

  // 각 슬롯 값은 목록의 id 문자열이거나 { custom: '직접 입력한 문구' } 이다.
  function resolveSubject(slots, v) {
    if (typeof v === 'object') return Object.assign({ en: clean(v.custom) }, slots.custom.subject);
    return byId(slots.subjects, v);
  }
  function resolveAction(slots, v) {
    if (typeof v === 'object') return { verb: clean(v.custom), mech: slots.custom.mech, terrain: null };
    return byId(slots.actions, v);
  }
  function resolveSetting(slots, v) {
    if (typeof v === 'object') return { en: clean(v.custom), terrains: null };
    return byId(slots.settings, v);
  }

  // sel: { tech, subject, action, setting, style, level (1|2|3), extras: [id] }
  function buildPrompt(slots, sel) {
    const tech = byId(slots.tech, sel.tech);
    const subject = resolveSubject(slots, sel.subject);
    const action = resolveAction(slots, sel.action);
    const setting = resolveSetting(slots, sel.setting);
    if (action.terrain && setting.terrains && !setting.terrains.includes(action.terrain)) {
      throw new Error(`"${sel.action}" needs a ${action.terrain} setting, got ${setting.terrains}`);
    }

    const parts = [`${tech.lead}: ${subject.en} ${action.verb} ${setting.en}.`];
    if (sel.level >= 2) {
      parts.push(`The ${subject.short} ${fill(action.mech, subject)}`);
      parts.push(slots.fixed.quality, slots.fixed.richness);
      const style = sel.style ? byId(slots.styles, sel.style).en : '';
      if (style) parts.push(style);
      if (sel.level >= 3) {
        for (const id of sel.extras || []) parts.push(byId(slots.extras, id).en);
      }
      parts.push(slots.fixed.closing.replace('{cap}', tech.cap));
    }
    return parts.join(' ');
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomSelection(slots, keep) {
    const action = pick(slots.actions);
    const setting = pick(slots.settings.filter((s) => s.terrains.includes(action.terrain)));
    return Object.assign(
      { subject: pick(slots.subjects).id, action: action.id, setting: setting.id },
      keep
    );
  }

  root.ScenePrompt = { buildPrompt, randomSelection };
})(typeof window !== 'undefined' ? window : globalThis);
