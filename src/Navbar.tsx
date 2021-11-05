import React, { useRef, useState, useEffect } from 'react';
import { IFluidContainer } from '@fluidframework/fluid-static';
import { Providers } from '@microsoft/mgt-element';
import { Login } from '@microsoft/mgt-react';
import { BrainstormModel, createBrainstormModel } from "./BrainstormModel";
import { User } from './Types';

export function Navbar(props: { container: IFluidContainer, setSignedInUser: (user: User) => void}) {
    const [model] = useState<BrainstormModel>(createBrainstormModel(props.container));
    const userId = useRef<string>("");

    useEffect(() => {
      const login = document.querySelector("mgt-login");

      function userSignIn(e: Event) {
        console.log("User signed in");
        Providers.globalProvider.graph.client
          .api('me')
          .get()
          .then((me: any) => {
            if (me && me.id) {
              userId.current = me.id;
              props.setSignedInUser({userName: '', userId: me.id});
              model.setSignedInUserId(me.id);
            }
          });
      };

      function userSignOut(e: Event) {
        console.log("User logged out");
        if (userId.current) {
          model.deleteSignedOutUserId(userId.current);
        }
      }

      login?.addEventListener("loginCompleted", userSignIn);
      login?.addEventListener("logoutInitiated", userSignOut);

      return () => {
        login?.removeEventListener("loginCompleted", userSignIn);
        login?.removeEventListener("logoutCompleted", userSignOut);
      };
      
    }, [model, props]);

    return (
        <header>
          <div className="grid-container">
            <div className="left title">Let's Brainstorm</div>
            <div className="right login end">
              <Login></Login>
            </div>
          </div>
        </header>
      );
}