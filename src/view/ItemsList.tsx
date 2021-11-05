import { useEffect, useState } from "react";
import { BrainstormModel } from "../BrainstormModel";
import { ColorId, LikedNote } from "../Types";
import { CircleFillIcon } from '@fluentui/react-icons-mdl2';
import { ColorOptions } from "./Color";

export type ItemsListProps = Readonly<{
    model: BrainstormModel;
  }>;

export function ItemsList(props: ItemsListProps) {
    const { model } = props;
    const [notes, setNotes] = useState<readonly LikedNote[]>([]);
    // This runs when via model changes whether initiated by user or from external
    useEffect(() => {
        const syncLocalAndFluidState = () => {
            const likedNotes: LikedNote[] = model.LikedNotes;
            setNotes(likedNotes);
        };

        syncLocalAndFluidState();
        model.setChangeListener(syncLocalAndFluidState);
        return () => model.removeChangeListener(syncLocalAndFluidState);
    }, [model]);


    return (
        <div className="items-list">

                <div className="selected-items">
                    <h2 className="grid-container">
                        <div className="left heading">Selected Items</div>
                        <div className="right end mr-15 heading">Votes</div>
                    </h2>
                    {!!notes.length &&
                    <ul>
                        {notes.map((note, i) => {
                             const iconColor = ColorOptions[note.color as ColorId].base;
                            return (
                                <li key={i}>
                                    <div className="grid-container">
                                        <div className="left selecteditem">{note.text}</div>
                                        <div className="right end mr-15">
                                            <div className="icon-wrapper">
                                                <CircleFillIcon className="circle-icon" 
                                                    style={{color: iconColor}} />
                                                <span className="circle-icon-overlay">{note.numLikesCalculated}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                    {notes.length === 0 &&
                        <div className="selecteditem ml-10 pb-5">No notes selected</div>
                    }
                </div>
        </div>
    );
}