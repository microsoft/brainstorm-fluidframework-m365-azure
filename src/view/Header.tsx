import React, { useEffect, useState, useRef } from "react";
import {
  CommandBar,
  ICommandBarItemProps,
} from "@fluentui/react";
import { MgtTemplateProps, People, Person } from '@microsoft/mgt-react';
import { BrainstormModel } from "../BrainstormModel";
import { DefaultColor } from "./Color";
import { ColorPicker } from "./ColorPicker";
import { NoteData, User, UserAvailability } from "../Types";
import { NOTE_SIZE } from "./Note.style";
import { getUserAvailabilityValue, useEventBus, uuidv4 } from "../Utils";

export interface HeaderProps {
  model: BrainstormModel;
  author: User;
}

// Expose signed in userIds to other parts of app (quick and easy way)
let appSignedInUserIds: string[] = [];

export function getAppSignedInUserIds() {
  return appSignedInUserIds;
}

export function Header(props: HeaderProps) {
  const colorButtonRef = useRef<any>();
  const [color, setColor] = useState(DefaultColor);
  const { model } = props;
  const [signedInUserIds, setSignedInUserIds ] = useState<string[]>([]);
  const [userAvailability, setUserAvailability] = useState<UserAvailability>({ userId: '', availability: '' });

  useEventBus(
    'userAvailabilityChanged',
    (data: any) => setUserAvailability(data.payload)
  );

  // This runs when via model changes whether initiated by user or from external
  useEffect(() => {
    function signedInUserIdsChanged(changed: any, local: any) {
      if (changed.key === "userIds") {
        setSignedInUserIds(model.SignedInUserIds);
        // Update array that is used outside of component
        appSignedInUserIds = model.SignedInUserIds;
      }
    }

    model.setChangeListener(signedInUserIdsChanged);

    return () => model.removeChangeListener(signedInUserIdsChanged);
  }, [model]);

  const onAddNote = () => {
    const { scrollHeight, scrollWidth } = document.getElementById("NoteSpace")!;
    const id = uuidv4();
    const newCardData: NoteData = {
      id,
      position: {
        x: Math.floor(Math.random() * (scrollWidth - NOTE_SIZE.width)),
        y: Math.floor(Math.random() * (scrollHeight - NOTE_SIZE.height)),
      },
      author: props.author,
      numLikesCalculated: 0,
      didILikeThisCalculated: false,
      color
    };
    props.model.SetNote(id, newCardData);
  };

  const items: ICommandBarItemProps[] = [
    {
      key: "add",
      text: "Add note",
      onClick: onAddNote,
      iconProps: {
        iconName: "QuickNote",
      },
    },
    {
      componentRef: colorButtonRef,
      key: "color",
      text: "Default Color",
      iconProps: {
        iconName: "Color",
      },
      subMenuProps: {
        key: "color-picker",
        items: [{ key: "foo" }],
        onRenderMenuList: () => (
          <ColorPicker
            parent={colorButtonRef}
            selectedColor={color}
            setColor={setColor}
          />
        ),
      },
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: "presence",
      onRender: () => {

        const PersonTemplate = ({ dataContext }: MgtTemplateProps) => {
          const person = dataContext.person;
          const availability = getUserAvailabilityValue(person.id, userAvailability);
          const baseProps = { userId: person.id, showPresence: true, userAvailability: dataContext.userAvailability };
          const personProps = (availability) 
            ? {...baseProps, personPresence:{ activity: availability, availability: availability } } 
            : baseProps;

          return (
            <Person {...personProps} />
          );
        };

        return (
          <div>              
              <People userIds={signedInUserIds} showPresence templateContext={{userAvailability}}>
                <PersonTemplate template="person" />
              </People>
          </div>
        );
      },
    },
  ];

  return (
    <CommandBar
      styles={{ root: { paddingLeft: 0 } }}
      items={items}
      farItems={farItems}      
    />
  );
}
