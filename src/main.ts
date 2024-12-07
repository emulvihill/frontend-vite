import './style.css'
import 'htmx.org';

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
  his: {},
  ile: {},
  leu: {},
  lys: {},
  met: {},
  phe: {},
  pro: {},
  ser: {},
  thr: {},
  trp: {},
  tyr: {},
  val: {},
}


Object.keys(aaConfig).forEach(async aa => {

  const config: Partial<Configuration> = Object.assign(
    {
      renderMode: "ball_and_stick",
      selectable: false,
      domElement: "viewport-" + aa,
      pdbData: await fetch(`/pdb/aa/${aa}.pdb`).then(r => r.text())
    },
    aaConfig[aa]);

  config.onInfoUpdated = (info: ContextInfo) => {
    document.getElementById("info-" + aa)!.innerHTML = formatInfo(config, info);
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
      return `Distance: ${info.distance}`;
    case "rotation":
      return `Rotation: ${info.rotationAngle}`;
    case "torsion":
      return `Torsion: ${info.torsionAngle}`;
    default:
      return info.message || ""
  }

}

