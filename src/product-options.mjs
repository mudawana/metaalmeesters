// Single, browser- and server-compatible product catalogue for the configurator.
// These names come from the client's list and anodic colour-card photo.
// RGB swatches and all 3D glass patterns are INDICATIVE, not calibrated colour chips.

export const FRAMES=[
 {id:'zwart',label:'RAL 9005 · Zwart',color:'#232625',group:'RAL'},
 {id:'antraciet',label:'RAL 7016 · Antraciet',color:'#414549',group:'RAL'},
 {id:'wit',label:'RAL 9010 · Wit',color:'#e6e3d8',group:'RAL'},
 {id:'ral7035',label:'RAL 7035 · Lichtgrijs',color:'#b8babe',group:'RAL'},
 {id:'ral6005',label:'RAL 6005 · Groen',color:'#244e36',group:'RAL'},
 {id:'ral5008',label:'RAL 5008 · Blauw',color:'#303e4b',group:'RAL'},
 {id:'anodic-gold',label:'Anodic Gold',color:'#c7ad68',group:'Anodic'},
 {id:'anodic-champagne',label:'Anodic Champagne',color:'#ceca9b',group:'Anodic'},
 {id:'anodic-bronze',label:'Anodic Bronze',color:'#94948d',group:'Anodic'},
 {id:'anodic-brown',label:'Anodic Brown',color:'#aa987d',group:'Anodic'},
 {id:'anodic-natura',label:'Anodic Natura',color:'#e3e2db',group:'Anodic'},
 {id:'anodic-saphire',label:'Anodic Saphire',color:'#8da5b2',group:'Anodic'},
 {id:'anodic-malachite',label:'Anodic Malachite',color:'#a3b7b2',group:'Anodic'},
 {id:'anodic-black',label:'Anodic Black',color:'#505354',group:'Anodic'},
 // Old shared design URLs/localStorage may contain these identifiers.
 {id:'brons',label:'Anodic Bronze (vorige selectie)',color:'#94948d',group:'Anodic',legacy:true},
 {id:'anodic-naturel',label:'Anodic Natura (vorige selectie)',color:'#e3e2db',group:'Anodic',legacy:true},
 {id:'andere',label:'Andere RAL- of anodic kleur',color:'#a2a19d',group:'Overig'}
];

export const GLASSES=[
 {id:'helder',label:'Helder glas',group:'Basis',description:'Klassiek transparant · gehard of gelaagd volgens project',safety:'Uitvoering volgens technische bevestiging',visual:'clear',color:'#d9edf2'},
 {id:'gelaagd',label:'Gelaagd helder glas',group:'Basis',description:'Transparant veiligheidsglas opgebouwd uit glaslagen',safety:'Gelaagd',visual:'clear',color:'#d8e8eb'},
 {id:'mat',label:'Mat gelaagd glas',group:'Mat & getint',description:'Privacy · lichtdoorlatend, minder doorkijk',safety:'Gelaagd',visual:'frost',color:'#d5d9d5'},
 {id:'grijs',label:'Grijs gelaagd glas',group:'Mat & getint',description:'Koel getint · ingetogen uitstraling',safety:'Gelaagd volgens klantopgave',visual:'tint',color:'#777f86'},
 {id:'brons-glas',label:'Brons gelaagd glas',group:'Mat & getint',description:'Warme bruintint · stijlvolle transparantie',safety:'Gelaagd volgens klantopgave',visual:'tint',color:'#937865'},
 {id:'zwart-glas',label:'Zwart gelaagd glas',group:'Mat & getint',description:'Diep donker getint · beperkte doorkijk',safety:'Gelaagd volgens klantopgave',visual:'dark',color:'#393b3e'},
 {id:'crepe',label:'Crêpe glas',group:'Structuurglas',description:'Fijn gekreukelde oppervlaktestructuur',safety:'Gehard/gelaagd te bevestigen',visual:'crepe',color:'#c9dadd'},
 {id:'draadglas',label:'Draadglas',group:'Structuurglas',description:'Karakteristiek zichtbaar draadpatroon',safety:'Type en veiligheidstoepassing te bevestigen',visual:'wire',color:'#c3d1d1'},
 {id:'oceanic',label:'Oceanic glas',group:'Structuurglas',description:'Waterachtige golvende structuur',safety:'Gehard/gelaagd te bevestigen',visual:'ocean',color:'#b2cbd1'},
 {id:'martele',label:'Martelé glas',group:'Structuurglas',description:'Gehamerd, levendig reliëf',safety:'Gehard/gelaagd te bevestigen',visual:'hammer',color:'#c1d6d4'},
 {id:'canale',label:'Canalé glas',group:'Structuurglas',description:'Breed verticaal geribbeld profiel',safety:'Gehard/gelaagd te bevestigen',visual:'canale',color:'#c4d6db'},
 {id:'flute',label:'Flute glas',group:'Structuurglas',description:'Fijn verticaal geribbeld glas',safety:'Gehard/gelaagd te bevestigen',visual:'flute',color:'#cadcde'},
 {id:'rook',label:'Rookglas (vorige selectie)',group:'Mat & getint',description:'Getinte oudere selectie',safety:'Uitvoering te bevestigen',visual:'tint',color:'#777876',legacy:true},
 {id:'ribbel',label:'Ribbelglas (vorige selectie)',group:'Structuurglas',description:'Geribbelde oudere selectie',safety:'Uitvoering te bevestigen',visual:'flute',color:'#c7dbe0',legacy:true}
];

export const HANDLES=[
 {id:'lang',label:'Lange verticale greep',description:'Strakke lange staafgreep'},
 {id:'kort',label:'Korte verticale greep',description:'Compacte staafgreep'},
 {id:'knop',label:'Ronde knop',description:'Klassieke bolknop'},
 {id:'kruk',label:'Deurkruk',description:'Horizontale kruk'},
 {id:'greep-rond',label:'Ronde beugelgreep',description:'Gebogen beugel'},
 {id:'greep-vierkant',label:'Vierkante beugelgreep',description:'Rechthoekige U-greep'},
 {id:'greep-plat',label:'Platte greep',description:'Minimalistische vlakke greep'},
 {id:'greep-dubbel',label:'Dubbele stanggreep',description:'Twee evenwijdige staven'}
];

export const CLOSURES=[
 {id:'magneet',label:'Magneetsluiting',description:'Magnetische sluiting · technische uitvoering op aanvraag'},
 {id:'slotkast',label:'Slotkast',description:'Slotkast met sleutelgat · technische uitvoering op aanvraag'},
 {id:'geen',label:'Zonder zichtbaar slot',description:'Sluiting in overleg met het atelier'}
];
export const PANEL_LAYOUTS=[
 {id:'glas',label:'Volledig glas',description:'De hele deurvulling is glas'},
 {id:'staal-onder',label:'Stalen onderpaneel · 3 vakken',description:'Onderste deel dicht staal, daarboven twee glasvakken'}
];
export const glassById=(id)=>GLASSES.find(x=>x.id===id)||GLASSES[0];
export const handleById=(id)=>HANDLES.find(x=>x.id===id)||HANDLES[0];
export const closureById=(id)=>CLOSURES.find(x=>x.id===id)||CLOSURES[0];
export const lowerSteelMeters=(config,height,fixed=false)=>{
 if(fixed||config.panelLayout!=='staal-onder')return 0;
 const raw=Number(config.lowerPanelHeight);
 const requested=Number.isFinite(raw)?raw:650;
 return Math.min(Math.max(.25,requested/1000),Math.max(.25,height*.60));
};
