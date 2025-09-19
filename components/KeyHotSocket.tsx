import { createUseComponent } from "@tscircuit/core"
import type { CommonLayoutProps } from "@tscircuit/props"

const pinLabels = {
  "1": "pin1",
  "2": "pin2",
} as const
const pinNames = Object.values(pinLabels)

interface Props extends CommonLayoutProps {
  name: string
  connections: { pin1?: string, pin2?: string }
}

export const KeyHotSocket = (props: Props) => {
  return (
    <pushbutton
      layer="bottom"
      {...props}
      footprint={
        <footprint>
          <hole
            pcbX="3.1749999999999545mm"
            pcbY="-1.2699999999999818mm"
            diameter="2.9999939999999996mm"
          />
          <hole
            pcbX="-3.1749999999999545mm"
            pcbY="1.2700000000000955mm"
            diameter="2.9999939999999996mm"
          />
          <smtpad
            portHints={["2"]}
            pcbX="6.724904000000038mm"
            pcbY="-1.2699999999999818mm"
            width="2.8999941999999996mm"
            height="2.4999949999999997mm"
            shape="rect"
          />
          <smtpad
            portHints={["1"]}
            pcbX="-6.724904000000038mm"
            pcbY="1.2699999999999818mm"
            width="2.8999941999999996mm"
            height="2.4999949999999997mm"
            shape="rect"
          />
          <silkscreenpath
            route={[
              { x: -5.461000000000013, y: -0.4611370000000079 },
              { x: -5.461000000000013, y: -2.9209999999999354 },
              { x: -5.461000000000013, y: -2.9209999999999354 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: 5.4500017999999955, y: -2.950006799999869 },
              { x: -5.461000000000013, y: -2.950006799999869 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: 0.18298159999994823, y: 1.0549889999999778 },
              { x: 5.450027199999909, y: 1.0549889999999778 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: 5.450027199999909, y: 1.0549889999999778 },
              { x: 5.450027199999909, y: 0.4611370000000079 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: -2.944114000000127, y: 2.9450030000000424 },
              { x: -5.461000000000013, y: 2.9450030000000424 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: -1.707006999999976, y: 2.9450030000000424 },
              { x: -2.944114000000127, y: 2.9450030000000424 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: -1.707006999999976, y: 2.9450030000000424 },
              { x: -1.460311886129034, y: 2.9288336092640748 },
              { x: -1.2178378661753868, y: 2.8806021044970294 },
              { x: -0.9837338087377248, y: 2.801133754218995 },
              { x: -0.762005367588813, y: 2.6917883071702136 },
              { x: -0.5564464426572613, y: 2.5544367262343712 },
              { x: -0.37057426423848483, y: 2.3914291751993915 },
              { x: -0.20756921118118044, y: 2.2055548061152876 },
              { x: -0.07022039279377168, y: 1.9999940353145576 },
              { x: 0.03912207440475868, y: 1.7782641246765252 },
              { x: 0.11858727851722506, y: 1.5441589992735771 },
              { x: 0.1668155246366041, y: 1.301684331151364 },
              { x: 0.18298159999994823, y: 1.0549889999999778 },
            ]}
          />
        </footprint>
      }
      supplierPartNumbers={{
        jlcpcb: ["C41430893"],
      }}
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?uuid=c886ec2b42464573a88fc1f647577a49&pn=C5184526",
        rotationOffset: { x: 0, y: 0, z: 0 },
        positionOffset: { x: 0, y: 0, z: 0 },
      }}
      pinLabels={pinLabels}
      schPortArrangement={{
        leftSide: {
          direction: "top-to-bottom",
          pins: [1],
        },
        rightSide: {
          direction: "bottom-to-top",
          pins: [2],
        },
      }}
    />
  )
}

export const useKeyHotSocket = createUseComponent(KeyHotSocket, pinNames)
