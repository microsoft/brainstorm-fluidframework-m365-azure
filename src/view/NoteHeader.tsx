import {
  CommandBar,
  CommandBarButton,
  DirectionalHint,
  ICommandBarItemProps,
  IResizeGroupProps,
  ITooltipProps,
  mergeStyles,
  TooltipHost,
} from "@fluentui/react";
import { useRef, memo, useState } from "react";
import { Person } from "@microsoft/mgt-react";
import { ColorPicker } from "./ColorPicker";
import {
  getHeaderStyleForColor,
  deleteButtonStyle,
  colorButtonStyle,
  likesButtonStyle,
  tooltipHostStyle,
  likesButtonAuthorStyle,
} from "./Note.style";
import { ReactionListCallout } from "./ReactionListCallout";
import { NoteProps } from "./Note"
import { UserAvailability } from "../Types";
import { getUserAvailabilityValue, useEventBus } from "../Utils";

const HeaderComponent = (props: NoteProps) => {
  const colorButtonRef = useRef();
  const { user } = props;
  const [userAvailability, setUserAvailability] = useState<UserAvailability>({ userId: '', availability: '' });

  useEventBus(
    'userAvailabilityChanged',
    (data: any) => setUserAvailability(data.payload)
  );

  const headerProps = {
    className: mergeStyles(getHeaderStyleForColor(props.color))
  };

  const likeBtnTooltipProps: ITooltipProps = {

    onRenderContent: () => {
      const likedUserList = props.getLikedUsers();

      if (likedUserList.length === 0) {
        // Don't render a tooltip if no users reacted.
        return null;
      }
      return (
        <ReactionListCallout
          label={"Like Reactions"}
          reactionIconName={"Like"}
          usersToDisplay={likedUserList}
        />
      );
    },
    calloutProps: {
      beakWidth: 10,
    },
  };

  const items: ICommandBarItemProps[] = [
    {
      key: "persona",
      onRender: () => {
        const authorId = props.author.userId;
        const availability = getUserAvailabilityValue(authorId, userAvailability);
        const baseProps = { userId: authorId, showPresence: true };
        const personProps = (availability) 
          ? {...baseProps, personPresence:{activity: availability, availability: availability} } 
          : baseProps;

        return (
          <TooltipHost
            styles={{ root: { alignSelf: "center", display: "block", marginLeft: "5px" } }}
            content={props.author.userName}
          >
            <div className="note-person">
              <Person {...personProps } />
            </div>
          </TooltipHost>
        );
      },
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: "likes",
      onClick: props.onLike,
      text: props.numLikesCalculated.toString(),
      iconProps: {
        iconName: props.didILikeThisCalculated ? "LikeSolid" : "Like",
      },
      buttonStyles: isAuthorNote() ? likesButtonAuthorStyle : likesButtonStyle,
      commandBarButtonAs: (props) => {
        return (
          <TooltipHost
            tooltipProps={likeBtnTooltipProps}
            directionalHint={DirectionalHint.topAutoEdge}
            styles={tooltipHostStyle}
          >
            <CommandBarButton {...(props as any)} />
          </TooltipHost>
        );
      },
    },
    {
      // @ts-ignore
      componentRef: colorButtonRef,
      key: "color",
      iconProps: {
        iconName: "Color",
      },
      subMenuProps: {
        key: "color-picker",
        items: [{ key: "foo" }],
        onRenderMenuList: () => (
          <ColorPicker
            parent={colorButtonRef}
            selectedColor={props.color!}
            setColor={(color) => props.onColorChange(color)}
          />
        ),
      },
      buttonStyles: colorButtonStyle,
    },
    {
      key: "delete",
      iconProps: { iconName: "Clear" },
      title: "Delete Note",
      onClick: props.onDelete,
      buttonStyles: deleteButtonStyle,
    },
  ];

  // Don't add links button for author of note
  function isAuthorNote() {
    return user.userId && props.author.userId === user.userId;
  }

  const nonResizingGroup = (props: IResizeGroupProps) => (
    <div>
      <div style={{ position: "relative" }}>
        {props.onRenderData(props.data)}
      </div>
    </div>
  );

  return (
    <div {...headerProps}>
      <CommandBar
        resizeGroupAs={nonResizingGroup}
        styles={{
          root: { padding: 0, height: 36, backgroundColor: "transparent" },
        }}
        items={items}
        farItems={farItems}
      />
    </div>
  )
}

export const NoteHeader = memo(HeaderComponent, (prevProps, nextProps) => {
  return prevProps.color === nextProps.color
    && prevProps.numLikesCalculated === nextProps.numLikesCalculated
    && prevProps.didILikeThisCalculated === nextProps.didILikeThisCalculated
})

