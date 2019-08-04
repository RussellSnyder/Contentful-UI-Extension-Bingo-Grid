import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {TextInput, Checkbox, Button, FieldGroup, CheckboxField, Paragraph, DisplayText } from '@contentful/forma-36-react-components';
import {init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';

import './index.css';
import Space from './Space';

const LANGUAGE = 'en-US';

export class App extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    detachExternalChangeHandler = null;

    initializeCategories() {
        const categories = [];
        for (let i = 0; i < 25; i++) {
            categories.push(null)
        }
        return categories
    }


    constructor(props) {
        super(props);

        const fieldValue = props.sdk.field.getValue();

        const categories = fieldValue ? fieldValue.categories : []

        this.state = {
            categories
        }
    }

    componentDidMount() {
        // TODO check if categories is saved first
        let { categories } = this.state
        if (!categories || categories.length < 1) {
            const categories = this.initializeCategories()
            this.setState({
                categories: [...categories]
            })
        }

        this.props.sdk.window.startAutoResizer();

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
        this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);



    }

    componentWillUnmount() {
        if (this.detachExternalChangeHandler) {
            this.detachExternalChangeHandler();
        }
    }

    onExternalChange = value => {
        this.setState({value});
    };

    syncSDKWithState() {
        // this.props.sdk.field.removeValue();
        this.props.sdk.field.setValue(this.state);
    }

    onClearCategories() {
        this.setState({categories: this.initializeCategories()})
    }

    parseCategory(entry) {
        const { name, color } = entry.fields


        return {
            name: name[LANGUAGE],
            color: color[LANGUAGE]
        }
    }

    onAddCategory(i) {
        this.props.sdk.dialogs.selectSingleEntry({
            contentTypes: ['challengeSpaceCategories']
        }).then(selectedEntry => {
            const category = this.parseCategory(selectedEntry)

            let { categories } = this.state;
            categories[i] = category;

            this.setState({categories: categories}, () => this.syncSDKWithState())

        })
    }

    onRemoveCategory(i) {
        this.setState(oldState => {
            let { categories } = oldState;

            categories[i] = null;

            return ({categories})

        }, () => this.syncSDKWithState())

    }

    createGrid(categories) {
        return (
                <div className="bingo-board">
                    {categories.map((category, i) =>     {
                        return (
                                    <Space
                                            key={`space-${i}`}
                                            category={category}
                                            index={i}
                                            testid={`space-${i}`}
                                            addCategoryHandler={() => this.onAddCategory(i)}
                                            removeCategoryHandler={() => this.onRemoveCategory(i)}
                                    />
                        )
                    })}
                </div>
        )
    }

    render() {
        const { categories } = this.state;

        return (
                <div className="bingo-card-extension" style={{minHeight: 550}}>
                    <div style={{ textAlign: 'right' }} >
                        <Button buttonType="negative" icon="Close" onClick={() => this.onClearCategories()}>Clear</Button>
                    </div>
                    <hr/>
                    {this.createGrid(categories)}
                </div>
        );
    }
}

init(sdk => {
    ReactDOM.render(<App sdk={sdk}/>, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
    module.hot.accept();
}
