import React, { useState } from "react";
import chunk from "lodash/chunk";
import shuffle from "lodash/shuffle";
import styled from "styled-components";

export const SEIGE_COLOURS = {
    attacker: "#cf6514",
    defender: "#1370bb",
};

const TeamBase = styled.div`
    margin: 30px 30px;
    display: grid;

    grid-template:
        "big-input" 30px
        "input-list" max-content
        "teams" max-content / 100%;
`;

const TeamInput = styled.input`
    width: 100%;
    padding-left: 5px;
`;

const TeamInputPrompt = styled.div`
    color: rgba(255, 255, 255, 0.8);
    margin: 15px 0px 2.5px 5px;
`;

const TeamInputList = styled.ul`
    min-height: 50px;
    padding: 25px 5px;
    margin-top: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    color: rgba(255, 255, 255, 0.7);
    width: 100%;

    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const TeamInputListWrapper = styled.div`
    height: max-content;
`;

const SortSection = styled.div``;

export const SortButton = styled.button`
    width: 100%;
    font-size: 1.4rem;
    text-transform: uppercase;
    font-family: "r6-font";

    border: 1px solid white;
    background: #34a7e0;
    outline: none;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 25px;
    padding: 10px 5px;
`;

const SortedTeam = styled.div<{ team: "defender" | "attacker" }>`
    background: ${p => SEIGE_COLOURS[p.team]};
    text-align: center;
    font-size: 1.3rem;
    min-height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.75);
    border: 0.75px solid white;
    padding-top: 10px;
`;

const SortedTeamList = styled.ul`
    text-align: left;
    align-self: center;
    justify-self: center;
    font-family: "r6-font";
    text-transform: none;
    font-weight: 300;
    width: 100%;
    list-style: none;
    padding-left: 0px;

    & > li {
        background: rgba(5, 5, 5, 0.7);
        margin: 1px 0px;
        padding: 7.5px;
        padding-left: 5%;
    }
`;

const SortedTeamHeader = styled.div`
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    width: 100%;
    padding-bottom: 10px;
    font-family: "r6-font";
    text-transform: uppercase;
    letter-spacing: 1.5px;
`;

type Teams = {
    blue: string[];
    orange: string[];
};

const sortTeams = (gamers: string[]): Teams => {
    const [blue, orange] = chunk(shuffle(gamers), Math.ceil(gamers.length / 2));

    return {
        blue,
        orange,
    };
};

const TeamSorter: React.FC = () => {
    const [names, setNames] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [teams, setTeams] = useState<Teams>({ blue: [], orange: [] });

    const onSortTeamsClick = () => {
        setTeams(sortTeams(names));
    };
    return (
        <TeamBase>
            <TeamInput
                value={input}
                placeholder="Enter name..."
                onKeyDown={onEnter(setNames, setInput, names, input)}
                onChange={onInputChange(setInput)}
            />
            <TeamInputListWrapper>
                <TeamInputPrompt>click name to delete</TeamInputPrompt>
                <TeamInputList>
                    {names.map((item, i) => (
                        <li
                            key={item}
                            onClick={() => {
                                const copy = [...names];
                                copy.splice(i, 1);
                                setNames(copy);
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </TeamInputList>
            </TeamInputListWrapper>
            <SortSection>
                <SortButton onClick={onSortTeamsClick}>Sort Teams</SortButton>
                <SortedTeam team="attacker">
                    <SortedTeamHeader>Attacker</SortedTeamHeader>
                    <SortedTeamList>
                        {teams.orange.map(n => (
                            <li key={n}>{n}</li>
                        ))}
                    </SortedTeamList>
                </SortedTeam>
                <SortedTeam team="defender">
                    <SortedTeamHeader>Defender</SortedTeamHeader>
                    <SortedTeamList>
                        {teams.blue.map(n => (
                            <li key={n}>{n}</li>
                        ))}
                    </SortedTeamList>
                </SortedTeam>
            </SortSection>
        </TeamBase>
    );
};

export default TeamSorter;
function onInputChange(
    setInput: React.Dispatch<React.SetStateAction<string>>,
): ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined {
    return e => {
        setInput(e.target.value);
    };
}

function onEnter(
    setNames: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    names: string[],
    input: string,
): ((event: React.KeyboardEvent<HTMLInputElement>) => void) | undefined {
    return e => {
        if (names.includes(input) || input.trim() === "") {
            return;
        }
        if (e.keyCode === 13) {
            setNames([...names, input]);
            setInput("");
            return;
        }
    };
}
