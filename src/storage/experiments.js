(() => {
  const KEYS={experiments:'qgce.experiments.v1',notes:'qgce.notes.v1'};
  const safeRead=key=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}};
  QG.ExperimentStore={
    all:()=>safeRead(KEYS.experiments),
    save:entry=>{const all=safeRead(KEYS.experiments);all.unshift(entry);localStorage.setItem(KEYS.experiments,JSON.stringify(all.slice(0,60)));},
    remove:id=>{localStorage.setItem(KEYS.experiments,JSON.stringify(safeRead(KEYS.experiments).filter(x=>x.id!==id)));},
    clear:()=>localStorage.removeItem(KEYS.experiments),
    notes:()=>{try{return JSON.parse(localStorage.getItem(KEYS.notes)||'{}')}catch{return {}}},
    saveNotes:value=>localStorage.setItem(KEYS.notes,JSON.stringify(value))
  };
})();
