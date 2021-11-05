import { IPersonaStyles, List, Persona, PersonaSize } from "@fluentui/react";
import React from "react";
import { User } from "../Types";

export function PersonaList(props: { users: User[] }) {
  const personaStyles: Partial<IPersonaStyles> = {
    root: {
      marginTop: 10,
    },
  };

  const renderPersonaListItem = (item?: User) => {
    return (
      item && (
        <Persona
          text={item.userName}
          size={PersonaSize.size24}
          styles={personaStyles}
        ></Persona>
      )
    );
  };
  return <List items={props.users} onRenderCell={renderPersonaListItem}></List>;
}
