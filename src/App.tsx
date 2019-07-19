import React, { useEffect, useState, useCallback } from "react";
import TeamSorter from "./TeamSorter";
import styled from "styled-components";
import SpinToWin from "./SpinToWin";
import qs from "query-string";
import { decode } from "urlsafe-base64";
const { ungzip } = require("node-gzip");

// meh this is a dirty hack site for personal shit so bad code ahoy
let DID_RUN = false;

const AppWrap = styled.div`
    display: grid;
    grid-template: 100vh / 45vw max-content;
    gap: 5vw;
    justify-self: center;
    overflow-x: scroll;
`;

const App: React.FC = () => {
    const [state, setState] = useState({ attacker: [], defender: [] });
    const url = qs.parse(window.location.search);
    const [wait, setWait] = useState(true);
    const [didParse, setDidParse] = useState(false);

    async function wrap() {
        if (DID_RUN) {
            return;
        }
        if (url.state) {
            console.log("urlis");
            const debasedState = decode(url.state as string);
            const gunzipped = await ungzip(debasedState);
            DID_RUN = true;
            setState(JSON.parse(gunzipped.toString()));
        }
        DID_RUN = true;
    }
    wrap();

    console.log("will be ", state);

    return !DID_RUN ? (
        <div />
    ) : (
        <AppWrap>
            <TeamSorter />
            <SpinToWin defaultState={state} />
        </AppWrap>
    );
};

export default App;
