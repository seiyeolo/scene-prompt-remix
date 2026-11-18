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

  // sel: { tech, subject, action, setting, level (1|2|3), extras: [id] }
  function buildPrompt(slots, sel) {
    const tech = byId(slots.tech, sel.tech);
    const subject = byId(slots.subjects, sel.subject);
    const action = byId(slots.actions, sel.action);
    const setting = byId(slots.settings, sel.setting);
    if (action.terrain !== setting.terrain) {
      throw new Error(`"${action.id}" needs a ${action.terrain} setting, got ${setting.terrain}`);
    }

    const parts = [`${tech.lead}: ${subject.en} ${action.verb} ${setting.en}.`];
    if (sel.level >= 2) {
      parts.push(`The ${subject.short} ${fill(action.mech, subject)}`);
      parts.push(slots.fixed.quality, slots.fixed.richness);
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
    const setting = pick(slots.settings.filter((s) => s.terrain === action.terrain));
    return Object.assign(
      { subject: pick(slots.subjects).id, action: action.id, setting: setting.id },
      keep
    );
  }

  root.ScenePrompt = { buildPrompt, randomSelection };
})(typeof window !== 'undefined' ? window : globalThis);
