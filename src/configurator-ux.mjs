// Keep the customer-facing flow short without dropping made-to-measure options.
// A previously selected option remains visible even if it isn't a favourite.
export const STEPS=[
  {title:'Deurtype',hint:'Kies het soort deur dat u mooi vindt.'},
  {title:'Afmetingen',hint:'Geef de breedte en hoogte ongeveer op.'},
  {title:'Glas',hint:'Kies uw glas. Extra varianten zijn optioneel.'},
  {title:'Afwerking',hint:'Selecteer een kleur en een handgreep.'},
  {title:'Offerte',hint:'Bekijk uw ontwerp en vraag vrijblijvend een offerte.'}
];
export const FAVOURITES={
  glass:['helder','gelaagd','mat','flute'],
  frame:['zwart','antraciet','wit','anodic-gold'],
  handle:['lang','kort','kruk']
};
export function featuredOptions(options,featured,selected) {
 return options.filter(o=>featured.includes(o.id)||o.id===selected);
}
export function extraOptions(options,featured,selected) {
 return options.filter(o=>!featured.includes(o.id)&&o.id!==selected&&!o.legacy);
}
export function countExtra(options,featured,selected) {
 return extraOptions(options,featured,selected).length;
}
export const SIZE_CHOICES={
  enkel:[{label:'Compact',width:800,height:2100},{label:'Standaard',width:900,height:2200},{label:'Ruim',width:1000,height:2300}],
  dubbel:[{label:'Compact',width:1400,height:2100},{label:'Standaard',width:1600,height:2200},{label:'Ruim',width:2000,height:2300}],
  pivot:[{label:'Compact',width:900,height:2200},{label:'Standaard',width:1100,height:2400},{label:'Ruim',width:1400,height:2600}],
  wand:[{label:'Compact',width:2000,height:2200},{label:'Standaard',width:2600,height:2400},{label:'Ruim',width:3400,height:2600}],
  schuif:[{label:'Compact',width:900,height:2100},{label:'Standaard',width:1200,height:2200},{label:'Ruim',width:1600,height:2400}]
};
export const sizesForType=(type)=>SIZE_CHOICES[type]||SIZE_CHOICES.enkel;
