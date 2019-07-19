import React, { useState, useEffect } from "react";
import styled from "styled-components";
import sample from "lodash/sample";
import deepEqual from "lodash/isEqual";
import { SortButton, SEIGE_COLOURS } from "./TeamSorter";
import { encode } from "urlsafe-base64";
const { gzip } = require("node-gzip");

const SpinSectionBase = styled.div`
    display: grid;
    grid-template:
        "inputs" max-content
        "total-list" max-content
        "spin-area" max-content / 100%;

    color: rgba(255, 255, 255, 0.75);
    width: 45vw;
`;

const SpinSectionHeader = styled.h2<{ color: string }>`
    font-family: "r6-font";
    text-align: center;
    border: 2px solid white;
    padding: 5px;
    font-size: 1.2rem;
    background: ${p => p.color};
`;

const SpinSectionInputs = styled.div<{ hide: boolean }>`
    display: flex;
    flex-direction: column;
    height: min-content;
    display: ${p => p.hide && "none"};
`;
const SpinSectionInputButton = styled(SortButton)`
    background: rgba(255, 255, 255, 0.1);
    height: 35px;
    font-size: 1.1rem;
    padding: 0px;
    margin-bottom: 0px;
`;
const SpinSectionNameInput = styled.input`
    outline: 0px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.85);
    background: none;

    color: white;
    padding-left: 10px;
    font-size: 1.15rem;
    margin-bottom: 5px;
`;
const SpinSectionTextInput = styled.textarea`
    background: none;
    font-size: 1.05rem;
    padding-left: 10px;
    padding-top: 5px;
    border: 1px solid rgba(255, 255, 255, 0.85);
    color: white;
    resize: none;
    height: 100px;
`;

const SpinList = styled.div<{ hide: boolean }>`
    margin: 10px 0px;
    font-size: 16px;
    overflow-y: scroll;

    transition: height 0.3s ease-in-out;
    display: ${p => p.hide && "none"};
`;
const SpinListItem = styled.div``;

const SpinArea = styled.div`
    border: 2px solid white;
    height: 250px;
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    font-size: 2rem;
    background: radial-gradient(
        circle,
        rgba(52, 167, 224, 0.15) 0%,
        rgba(255, 255, 255, 0) 100%
    );
`;

const SpinAreaName = styled.h2`
    margin: 0px 0px 10px 0px;
    font-size: 1.6rem;
`;
const SpinAreaDesc = styled.span`
    font-size: 1.3rem;
`;

type Strat = {
    name: string;
    description: string;
};

const SpinSection = (props: {
    side: "defender" | "attacker";
    onUpdate: (p: Strat[]) => void;
    hideInputs: boolean;
    rand: Strat;
}) => {
    const [expand, setExpand] = useState(false);
    const [strats, setStrats] = useState<Strat[]>([]);
    const [strat, setStrat] = useState<Strat>({ name: "", description: "" });

    const onSaveStrat = () => {
        const newStrats = [...strats, strat];
        props.onUpdate(newStrats);
        setStrats(newStrats);
        setStrat({ name: "", description: "" });
    };

    return (
        <SpinSectionBase>
            <SpinSectionHeader color={SEIGE_COLOURS[props.side]}>
                {props.side}
            </SpinSectionHeader>
            <SpinSectionInputs hide={props.hideInputs}>
                <SpinSectionNameInput
                    placeholder="GIVE NAME TO STRAT"
                    onChange={e => {
                        setStrat({
                            ...strat,
                            name: e.target.value,
                        });
                    }}
                    value={strat.name}
                />
                <SpinSectionTextInput
                    placeholder="SMALL DESCRIPTION OF STRAT"
                    value={strat.description}
                    onChange={e => {
                        setStrat({
                            ...strat,
                            description: e.target.value,
                        });
                    }}
                />
                <SpinSectionInputButton onClick={onSaveStrat}>
                    SAVE
                </SpinSectionInputButton>
            </SpinSectionInputs>
            <SpinList
                style={{ height: expand ? 125 : 20 }}
                onClick={() => {
                    setExpand(!expand);
                }}
                hide={props.hideInputs}
            >
                click to expand (click on item to delet) <br /> <br />
                {strats.map((n, i) => (
                    <SpinListItem
                        key={JSON.stringify(n)}
                        onClick={() => {
                            const copy = [...strats];
                            copy.splice(i, 1);
                            setStrats(copy);
                        }}
                    >
                        {n.name}
                    </SpinListItem>
                ))}
            </SpinList>
            <SpinArea>
                <SpinAreaName>{props.rand.name}</SpinAreaName>
                <SpinAreaDesc>{props.rand.description}</SpinAreaDesc>
            </SpinArea>
        </SpinSectionBase>
    );
};

const SpinBase = styled.section`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    padding-right: 4vw;
`;

const SpinSectionWrapper = styled.div`
    display: flex;
    flex-direction: row;

    & > div:first-child {
        margin-right: 30px;
    }
`;

const SpinButton = styled(SortButton)`
    margin-bottom: 5px;
`;
const HideInputButton = styled(SpinButton)`
    font-size: 1.05;
    padding: 5px;
    background: rgba(25, 25, 25, 0.2);
`;

const defaultState = {
    defender: [] as Strat[],
    attacker: [] as Strat[],
};

const SpinToWin = (props: { defaultState: typeof defaultState }) => {
    const main = localStorage.getItem("main");
    const saved = main ? JSON.parse(main) : false;
    console.log(props);

    const keepHidden = localStorage.getItem("inputshidden") === "true";

    const isEmptyState = deepEqual(props.defaultState, defaultState);

    const [state, setState] = useState(
        isEmptyState ? saved : props.defaultState,
    );

    const [hidden, setHidden] = useState(keepHidden);

    const def = { name: "Roll me", description: "roll now!" } as Strat;

    const [rand, setRand] = useState({
        attackers: def,
        defenders: def,
    });
    const onClickRand = () => {
        const attackers = sample(state.attacker);
        const defenders = sample(state.defender);

        if (attackers == null || defenders == null) {
            return;
        }

        return setRand({ attackers, defenders });
    };

    const saveIt = () => {
        localStorage.setItem("main", JSON.stringify(state));
        localStorage.setItem("inputshidden", hidden.toString());
        async function wrap() {
            const gziped = await gzip(JSON.stringify(state));
            const smush = encode(gziped);
            window.history.pushState("", "", `/?state=${smush}`);
        }
        wrap();
    };
    saveIt();
    useEffect(saveIt);

    return (
        <SpinBase>
            <SpinButton onClick={onClickRand}>roll</SpinButton>
            <HideInputButton onClick={() => setHidden(!hidden)}>
                Hide inputs
            </HideInputButton>

            <SpinSectionWrapper>
                <SpinSection
                    hideInputs={hidden}
                    onUpdate={e =>
                        setState({
                            ...state,
                            defender: e,
                        })
                    }
                    side="defender"
                    rand={rand.defenders}
                />
                <SpinSection
                    hideInputs={hidden}
                    onUpdate={e =>
                        setState({
                            ...state,
                            attacker: e,
                        })
                    }
                    side="attacker"
                    rand={rand.attackers}
                />
            </SpinSectionWrapper>
        </SpinBase>
    );
};

export default SpinToWin;
