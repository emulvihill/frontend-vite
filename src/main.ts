import './style.css'

import { Configuration, ContextInfo, MolView } from "wglmolview";

const mvList = [];

const aaConfig: { [aa: string]: Partial<Configuration> } = {
  ala: {
    selectable: true,
    selectionMode: "identify"
  },
  arg: {
    selectable: true,
    selectionMode: "distance"
  },
  asn: {
    selectable: true,
    selectionMode: "rotation"
  },
  asp: {
    selectable: true,
    selectionMode: "torsion"
  },
  cys: {
    renderMode: "sticks"
  },
  gln: {
    renderMode: "space_fill"
  },
  glu: {},
  gly: {},
  his: {
    renderMode: "sticks"
  },
  ile: {
    renderMode: "space_fill"
  },
  leu: {},
  lys: {},
  met: {
    renderMode: "sticks"
  },
  phe: {},
  pro: {
    renderMode: "space_fill"
  },
  ser: {},
  thr: {
    renderMode: "sticks"
  },
  trp: {},
  tyr: {
    renderMode: "space_fill"
  },
  val: {},
}

Object.keys(aaConfig).forEach(async aa => {

  const config: Partial<Configuration> = Object.assign(
    {
      renderMode: "ball_and_stick",
      selectable: false,
      rotationVertical: 0,
      rotationHorizontal: 0,
      domElement: "viewport-" + aa,
      pdbData: await fetch(`/pdb/aa/${aa}.pdb`).then(r => r.text())
    },
    aaConfig[aa]);

  config.onInfoUpdated = (info: ContextInfo) => {
    const infoElem = document.getElementById("info-" + aa);
    infoElem && (infoElem.innerHTML = formatInfo(config, info));
  }

  if (document.getElementById("viewport-" + aa)) {
    mvList.push(new MolView(config));
  }
});

function formatInfo(aa: Partial<Configuration>, info: ContextInfo): string {

  switch (aa.selectionMode) {
    case "identify":
      return info.message || "";
    case "distance":
      return info.distance! > 0 ? `Distance: ${truncateDecimals(info.distance!, 3)} Å` : "";
    case "rotation":
      return info.rotationAngle! >= 0 ? `Rotation Angle: ${truncateDecimals(info.rotationAngle!, 3)} °` : "";
    case "torsion":
      return info.torsionAngle! >= 0 ? `Torsion Angle: ${truncateDecimals(info.torsionAngle!, 3)} °` : "";
    default:
      return info.message || ""
  }
}

function truncateDecimals(num: number, digits: number) {
  const numS = num.toString();
  const decPos = numS.indexOf('.');
  const substrLength = decPos == -1 ? numS.length : 1 + decPos + digits;
  const trimmedResult = numS.substring(0, substrLength);
  return isNaN(Number(trimmedResult)) ? 0 : parseFloat(trimmedResult);
}
