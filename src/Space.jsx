import {Button, CheckboxField, Icon, FieldGroup} from "@contentful/forma-36-react-components";
import React from "react";

function Space(props) {
    const {category, index, addCategoryHandler, removeCategoryHandler, toggleAnyHandler} = props

    const EmptySpace = <div className="bingo-space">
        <Button icon="Plus"
                buttonType="primary"
                onClick={() => addCategoryHandler()}/>
    </div>

    const FilledSpace = (category) => {

        const {name, color} = category

        return (
                <div className="bingo-space"
                     style={{backgroundColor: color}}>
                    <div className="content">
                        <h3><span>{name}</span>
                            <Icon icon="Close"
                                  style={{ position: "absolute", right: '3px', top: '3px' }}
                                  color="negative"
                                  onClick={() => removeCategoryHandler()}
                            />
                        </h3>
                    </div>
                </div>)
    }

    return category ? FilledSpace(category) : EmptySpace
}

export default Space
