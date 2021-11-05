/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons, ThemeProvider } from "@fluentui/react";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrainstormView } from './view/BrainstormView';
import "./view/index.css";
import "./view/App.css";
import { themeNameToTheme } from './view/Themes';
import { Navbar } from './Navbar';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import useIsSignedIn from './useIsSignedIn';
import UserContext from "./userContext";
import { User } from "./Types";
import { getFluidContainer } from "./Utils";
import SignalRConnection from "./SignalRConnection";
import { CacheService } from '@microsoft/mgt-react';

Providers.globalProvider = new Msal2Provider({
    clientId: '259fb0fd-a369-4003-a93c-66c8405567f3'
});

CacheService.config.presence.invalidationPeriod = 5000; // 10 seconds

export async function start() {
    initializeIcons();

    let { container } = await getFluidContainer();

    if (!container.connected) {
        await new Promise<void>((resolve) => {
            container.once("connected", () => {
                resolve();
            });
        });
    }

    function Main(props: any) {
        const [isSignedIn] = useIsSignedIn();
        const [user, setUser] = useState<User>({ userName: '', userId: '' });

        function setSignedInUser(user: User) {
            setUser(user);
        }

        return (
            <React.StrictMode>
                <ThemeProvider theme={themeNameToTheme("default")}>
                    <UserContext.Provider value={user}>
                        <Navbar container={container} setSignedInUser={setSignedInUser} />
                        <main>
                            {isSignedIn &&
                                <div>
                                    <SignalRConnection />
                                    <BrainstormView container={container} />
                                </div>
                            }
                            {!isSignedIn &&
                                <h2>Welcome to Brainstorm! Please sign in to get started.</h2>
                            }
                        </main>
                    </UserContext.Provider>
                </ThemeProvider>
            </React.StrictMode>
        )
    }   

    ReactDOM.render(
        <Main />,
        document.getElementById('root')
    );
}

start().catch((error) => console.error(error));
