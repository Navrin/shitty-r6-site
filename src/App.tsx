import React, { useEffect, useState, useCallback } from "react";
import TeamSorter from "./TeamSorter";
import styled from "styled-components";
import SpinToWin from "./SpinToWin";
import { decode } from "urlsafe-base64";

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
    return (
        <AppWrap>
            <TeamSorter />
            <SpinToWin defaultState={state} />
        </AppWrap>
    );
};

export default App;
