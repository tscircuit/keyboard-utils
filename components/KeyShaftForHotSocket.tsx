import { createUseComponent } from "@tscircuit/core"
import type { CommonLayoutProps } from "@tscircuit/props"

const pinLabels = {
  "1": "pin1",
  "2": "pin2",
} as const
const pinNames = Object.values(pinLabels)

interface Props extends CommonLayoutProps {
  name: string
}

export const KeyShaftForHotSocket = (props: Props) => {
  return (
    <chip
      {...props}
      noSchematicRepresentation
      schWidth={0.1}
      schHeight={0.1}
      supplierPartNumbers={{
        jlcpcb: ["C400227"],
      }}
      footprint={
        <footprint>
          <hole
            pcbX="0.6349999999999909mm"
            pcbY="-3.1149987999999666mm"
            diameter="4.1999916mm"
          />
          {/* <platedhole
            portHints={["1"]}
            pcbX="-3.1749999999999545mm"
            pcbY="-0.574998800000003mm"
            outerDiameter="2.3999951999999998mm"
            holeDiameter="1.5999967999999998mm"
            shape="circle"
          />
          <platedhole
            portHints={["2"]}
            pcbX="3.1749999999999545mm"
            pcbY="1.9650012000000743mm"
            outerDiameter="2.3999951999999998mm"
            holeDiameter="1.5999967999999998mm"
            shape="circle"
          /> */}
          <silkscreenpath
            route={[
              { x: -7.165009800000007, y: 4.685011000000031 },
              { x: 8.435009799999989, y: 4.685011000000031 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: -7.165009800000007, y: -10.915008600000078 },
              { x: 8.435009799999989, y: -10.915008600000078 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: -7.165009800000007, y: 4.685011000000031 },
              { x: -7.165009800000007, y: -10.915008600000078 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: 8.435009799999989, y: 4.685011000000031 },
              { x: 8.435009799999989, y: -10.915008600000078 },
            ]}
          />
        </footprint>
      }
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?uuid=c00f29e7afb64c29bc388e168980ded2&pn=C400227",
        rotationOffset: { x: 0, y: 0, z: 90 },
        positionOffset: { x: 0, y: 0, z: 0 },
      }}
      pinLabels={pinLabels}
      schPinSpacing={0.75}
      schPortArrangement={{
      }}
    />
  )
}

export const useKeyShaftForHotSocket = createUseComponent(KeyShaftForHotSocket, pinNames)
