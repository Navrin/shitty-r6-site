import qs from "query-string";
import { decode } from "urlsafe-base64";
const { ungzip } = require("node-gzip");

export type Strat = {
    name: string;
    description: string;
};

class StratStore {
    defenders: Strat[] = [];
    attackers: Strat[] = [];

    constructor() {
        const url = qs.parse(window.location.search);

        const wrap = async () => {
            if (url.state) {
                const debasedState = decode(url.state as string);
                const gunzipped = await ungzip(debasedState);
                const parsed = JSON.parse(gunzipped);

                this.defenders = parsed.defenders;
                this.attackers = parsed.attackers;
            }
        };
        wrap();
    }

    addStratBase = (location: "defenders" | "attackers") => (strat: Strat) => {
        this[location].push(strat);
    };

    addDefenderStrat = this.addStratBase("defenders");
    addAttackerStrat = this.addStratBase("attackers");
}
