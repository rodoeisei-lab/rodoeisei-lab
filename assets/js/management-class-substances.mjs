export const MANAGEMENT_CONCENTRATION_SOURCE = Object.freeze({
  title: "作業環境評価基準 別表",
  url: "https://www.jaish.gr.jp/horei/hor1-18/hor1-18-2-1-2.html",
  checkedAt: "2026-08-26",
  conditions: "温度25℃・1気圧の空気中",
});

export const SUBSTANCE_CATEGORY_LABELS = Object.freeze({
  popular: "よく使う物質",
  organic: "有機溶剤",
  specified: "特化物・金属等",
  lead: "鉛",
  all: "すべての登録物質",
});

// 作業環境評価基準の別表に管理濃度が定められている物を登録する。
// 混合有機溶剤の換算値、定量下限未満の採用値などは別途判断が必要。
export const MANAGEMENT_CONCENTRATION_SUBSTANCES = Object.freeze([
  { id: "acrylamide", name: "アクリルアミド", category: "specified", value: 0.1, unit: "mg/m³" },
  { id: "acrylonitrile", name: "アクリロニトリル", category: "specified", value: 2, unit: "ppm" },
  { id: "alkyl-mercury", name: "アルキル水銀化合物（アルキル基がメチル基又はエチル基である物に限る）", category: "specified", value: 0.01, unit: "mg/m³", basis: "水銀として" },
  { id: "ethylbenzene", name: "エチルベンゼン", category: "specified", value: 20, unit: "ppm", popular: true },
  { id: "ethylene-imine", name: "エチレンイミン", category: "specified", value: 0.05, unit: "ppm" },
  { id: "ethylene-oxide", name: "エチレンオキシド", category: "specified", value: 1, unit: "ppm" },
  { id: "vinyl-chloride", name: "塩化ビニル", category: "specified", value: 2, unit: "ppm" },
  { id: "chlorine", name: "塩素", category: "specified", value: 0.5, unit: "ppm" },
  { id: "pcb", name: "塩素化ビフェニル（別名：PCB）", category: "specified", value: 0.01, unit: "mg/m³" },
  { id: "o-toluidine", name: "オルト-トルイジン", category: "specified", value: 1, unit: "ppm" },
  { id: "o-phthalonitrile", name: "オルト-フタロジニトリル", category: "specified", value: 0.01, unit: "mg/m³" },
  { id: "cadmium", name: "カドミウム及びその化合物", category: "specified", value: 0.05, unit: "mg/m³", basis: "カドミウムとして" },
  { id: "chromic-acid", name: "クロム酸及びその塩", category: "specified", value: 0.05, unit: "mg/m³", basis: "クロムとして" },
  { id: "chloroform", name: "クロロホルム", category: "specified", value: 3, unit: "ppm" },
  { id: "vanadium-pentoxide", name: "五酸化バナジウム", category: "specified", value: 0.03, unit: "mg/m³", basis: "バナジウムとして" },
  { id: "cobalt", name: "コバルト及び無機化合物", category: "specified", value: 0.02, unit: "mg/m³", basis: "コバルトとして" },
  { id: "coal-tar", name: "コールタール", category: "specified", value: 0.2, unit: "mg/m³", basis: "ベンゼン可溶性成分として" },
  { id: "propylene-oxide", name: "酸化プロピレン", category: "specified", value: 2, unit: "ppm" },
  { id: "antimony-trioxide", name: "三酸化二アンチモン", category: "specified", value: 0.1, unit: "mg/m³", basis: "アンチモンとして" },
  { id: "potassium-cyanide", name: "シアン化カリウム", category: "specified", value: 3, unit: "mg/m³", basis: "シアンとして" },
  { id: "hydrogen-cyanide", name: "シアン化水素", category: "specified", value: 3, unit: "ppm" },
  { id: "sodium-cyanide", name: "シアン化ナトリウム", category: "specified", value: 3, unit: "mg/m³", basis: "シアンとして" },
  { id: "carbon-tetrachloride", name: "四塩化炭素", category: "specified", value: 5, unit: "ppm" },
  { id: "dioxane", name: "1,4-ジオキサン", category: "specified", value: 10, unit: "ppm" },
  { id: "dichloroethane", name: "1,2-ジクロロエタン（別名：二塩化エチレン）", category: "specified", value: 10, unit: "ppm" },
  { id: "moca", name: "3,3′-ジクロロ-4,4′-ジアミノジフェニルメタン（MOCA）", category: "specified", value: 0.005, unit: "mg/m³" },
  { id: "dichloropropane", name: "1,2-ジクロロプロパン", category: "specified", value: 1, unit: "ppm" },
  { id: "dichloromethane", name: "ジクロロメタン（別名：二塩化メチレン）", category: "specified", value: 50, unit: "ppm" },
  { id: "ddvp", name: "ジメチル-2,2-ジクロロビニルホスフェイト（別名：DDVP）", category: "specified", value: 0.1, unit: "mg/m³" },
  { id: "dimethylhydrazine", name: "1,1-ジメチルヒドラジン", category: "specified", value: 0.01, unit: "ppm" },
  { id: "methyl-bromide", name: "臭化メチル", category: "specified", value: 1, unit: "ppm" },
  { id: "dichromic-acid", name: "重クロム酸及びその塩", category: "specified", value: 0.05, unit: "mg/m³", basis: "クロムとして" },
  { id: "mercury", name: "水銀及びその無機化合物（硫化水銀を除く）", category: "specified", value: 0.025, unit: "mg/m³", basis: "水銀として" },
  { id: "styrene", name: "スチレン", category: "specified", value: 20, unit: "ppm", popular: true },
  { id: "tetrachloroethane", name: "1,1,2,2-テトラクロロエタン（別名：四塩化アセチレン）", category: "specified", value: 1, unit: "ppm" },
  { id: "tetrachloroethylene", name: "テトラクロロエチレン（別名：パークロルエチレン）", category: "specified", value: 25, unit: "ppm" },
  { id: "trichloroethylene", name: "トリクロロエチレン", category: "specified", value: 10, unit: "ppm" },
  { id: "tdi", name: "トリレンジイソシアネート", category: "specified", value: 0.005, unit: "ppm" },
  { id: "naphthalene", name: "ナフタレン", category: "specified", value: 10, unit: "ppm" },
  { id: "nickel", name: "ニッケル化合物（ニッケルカルボニルを除き、粉状の物に限る）", category: "specified", value: 0.1, unit: "mg/m³", basis: "ニッケルとして", popular: true },
  { id: "nickel-carbonyl", name: "ニッケルカルボニル", category: "specified", value: 0.001, unit: "ppm" },
  { id: "nitroglycol", name: "ニトログリコール", category: "specified", value: 0.05, unit: "ppm" },
  { id: "p-nitrochlorobenzene", name: "パラ-ニトロクロルベンゼン", category: "specified", value: 0.6, unit: "mg/m³" },
  { id: "arsenic", name: "砒素及びその化合物（アルシン及び砒化ガリウムを除く）", category: "specified", value: 0.003, unit: "mg/m³", basis: "砒素として" },
  { id: "hydrogen-fluoride", name: "弗化水素", category: "specified", value: 0.5, unit: "ppm" },
  { id: "beta-propiolactone", name: "ベータ-プロピオラクトン", category: "specified", value: 0.5, unit: "ppm" },
  { id: "beryllium", name: "ベリリウム及びその化合物", category: "specified", value: 0.001, unit: "mg/m³", basis: "ベリリウムとして" },
  { id: "benzene", name: "ベンゼン", category: "specified", value: 1, unit: "ppm" },
  { id: "benzotrichloride", name: "ベンゾトリクロリド", category: "specified", value: 0.05, unit: "ppm" },
  { id: "pcp", name: "ペンタクロルフェノール（別名：PCP）及びそのナトリウム塩", category: "specified", value: 0.5, unit: "mg/m³", basis: "ペンタクロルフェノールとして" },
  { id: "formaldehyde", name: "ホルムアルデヒド", category: "specified", value: 0.1, unit: "ppm", popular: true },
  { id: "manganese", name: "マンガン及びその化合物", category: "specified", value: 0.05, unit: "mg/m³", basis: "マンガンとして" },
  { id: "mibk", name: "メチルイソブチルケトン（MIBK）", category: "specified", value: 20, unit: "ppm", popular: true },
  { id: "methyl-iodide", name: "沃化メチル", category: "specified", value: 2, unit: "ppm" },
  { id: "rcf", name: "リフラクトリーセラミックファイバー", category: "specified", value: 0.3, unit: "本/cm³", basis: "5μm以上の繊維として" },
  { id: "hydrogen-sulfide", name: "硫化水素", category: "specified", value: 1, unit: "ppm" },
  { id: "dimethyl-sulfate", name: "硫酸ジメチル", category: "specified", value: 0.1, unit: "ppm" },
  { id: "asbestos", name: "石綿", category: "specified", value: 0.15, unit: "本/cm³", basis: "5μm以上の繊維として" },
  { id: "lead", name: "鉛及びその化合物", category: "lead", value: 0.05, unit: "mg/m³", basis: "鉛として", popular: true },
  { id: "acetone", name: "アセトン", category: "organic", value: 500, unit: "ppm", popular: true },
  { id: "isobutyl-alcohol", name: "イソブチルアルコール", category: "organic", value: 50, unit: "ppm" },
  { id: "ipa", name: "イソプロピルアルコール（IPA）", category: "organic", value: 200, unit: "ppm", popular: true },
  { id: "isopentyl-alcohol", name: "イソペンチルアルコール（別名：イソアミルアルコール）", category: "organic", value: 100, unit: "ppm" },
  { id: "ethyl-ether", name: "エチルエーテル", category: "organic", value: 400, unit: "ppm" },
  { id: "egme", name: "エチレングリコールモノエチルエーテル（別名：セロソルブ）", category: "organic", value: 5, unit: "ppm" },
  { id: "egmea", name: "エチレングリコールモノエチルエーテルアセテート（別名：セロソルブアセテート）", category: "organic", value: 5, unit: "ppm" },
  { id: "egbe", name: "エチレングリコールモノ-ノルマル-ブチルエーテル（別名：ブチルセロソルブ）", category: "organic", value: 25, unit: "ppm" },
  { id: "egme-methyl", name: "エチレングリコールモノメチルエーテル（別名：メチルセロソルブ）", category: "organic", value: 0.1, unit: "ppm" },
  { id: "o-dichlorobenzene", name: "オルト-ジクロルベンゼン", category: "organic", value: 25, unit: "ppm" },
  { id: "xylene", name: "キシレン", category: "organic", value: 50, unit: "ppm", popular: true },
  { id: "cresol", name: "クレゾール", category: "organic", value: 5, unit: "ppm" },
  { id: "chlorobenzene", name: "クロルベンゼン", category: "organic", value: 10, unit: "ppm" },
  { id: "isobutyl-acetate", name: "酢酸イソブチル", category: "organic", value: 150, unit: "ppm" },
  { id: "isopropyl-acetate", name: "酢酸イソプロピル", category: "organic", value: 100, unit: "ppm" },
  { id: "isopentyl-acetate", name: "酢酸イソペンチル（別名：酢酸イソアミル）", category: "organic", value: 50, unit: "ppm" },
  { id: "ethyl-acetate", name: "酢酸エチル", category: "organic", value: 200, unit: "ppm" },
  { id: "n-butyl-acetate", name: "酢酸ノルマル-ブチル", category: "organic", value: 150, unit: "ppm" },
  { id: "n-propyl-acetate", name: "酢酸ノルマル-プロピル", category: "organic", value: 200, unit: "ppm" },
  { id: "n-pentyl-acetate", name: "酢酸ノルマル-ペンチル（別名：酢酸ノルマル-アミル）", category: "organic", value: 50, unit: "ppm" },
  { id: "methyl-acetate", name: "酢酸メチル", category: "organic", value: 200, unit: "ppm" },
  { id: "cyclohexanol", name: "シクロヘキサノール", category: "organic", value: 25, unit: "ppm" },
  { id: "cyclohexanone", name: "シクロヘキサノン", category: "organic", value: 20, unit: "ppm" },
  { id: "dichloroethylene", name: "1,2-ジクロルエチレン（別名：二塩化アセチレン）", category: "organic", value: 150, unit: "ppm" },
  { id: "dmf", name: "N,N-ジメチルホルムアミド（DMF）", category: "organic", value: 10, unit: "ppm" },
  { id: "thf", name: "テトラヒドロフラン（THF）", category: "organic", value: 50, unit: "ppm" },
  { id: "trichloroethane", name: "1,1,1-トリクロルエタン", category: "organic", value: 200, unit: "ppm" },
  { id: "toluene", name: "トルエン", category: "organic", value: 20, unit: "ppm", popular: true },
  { id: "carbon-disulfide", name: "二硫化炭素", category: "organic", value: 1, unit: "ppm" },
  { id: "n-hexane", name: "ノルマルヘキサン（n-ヘキサン）", category: "organic", value: 40, unit: "ppm", popular: true },
  { id: "1-butanol", name: "1-ブタノール", category: "organic", value: 25, unit: "ppm" },
  { id: "2-butanol", name: "2-ブタノール", category: "organic", value: 100, unit: "ppm" },
  { id: "methanol", name: "メタノール", category: "organic", value: 200, unit: "ppm", popular: true },
  { id: "mek", name: "メチルエチルケトン（MEK）", category: "organic", value: 200, unit: "ppm", popular: true },
  { id: "methylcyclohexanol", name: "メチルシクロヘキサノール", category: "organic", value: 50, unit: "ppm" },
  { id: "methylcyclohexanone", name: "メチルシクロヘキサノン", category: "organic", value: 50, unit: "ppm" },
  { id: "methyl-n-butyl-ketone", name: "メチル-ノルマル-ブチルケトン", category: "organic", value: 5, unit: "ppm" },
]);

export function getManagementConcentrationSubstance(id) {
  return MANAGEMENT_CONCENTRATION_SUBSTANCES.find((substance) => substance.id === id) || null;
}

export function getManagementConcentrationSubstances(category = "all") {
  if (category === "popular") {
    return MANAGEMENT_CONCENTRATION_SUBSTANCES.filter((substance) => substance.popular);
  }

  if (category === "all") {
    return MANAGEMENT_CONCENTRATION_SUBSTANCES;
  }

  return MANAGEMENT_CONCENTRATION_SUBSTANCES.filter((substance) => substance.category === category);
}

export function formatManagementConcentration(substance) {
  if (!substance) return "";
  return `${substance.basis ? `${substance.basis} ` : ""}${substance.value} ${substance.unit}`;
}
