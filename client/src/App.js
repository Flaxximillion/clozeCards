import React, {Component} from 'react';
import './App.css';
import ReactDOM from 'react-dom';


class GenerateCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answer: ''
        }
    }

    handleQuestion(event) {
        this.setState({question: event.target.value})
    }

    handleAnswer(event) {
        this.setState({answer: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        let card = this;
        fetch(`cards/submit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: card.state.question,
                answer: card.state.answer
            })
        })
    }

    render() {
        return (
            <section>
                <div ref={(div) => {
                    this.submitDiv = div;
                }}>
                    Submit a card
                </div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label>
                        Question (replace cloze answer with !):
                        <input type="text" name="answer" ref={(input) => {
                            this.textInput = input;
                        }} onChange={this.handleQuestion.bind(this)}/>
                    </label>

                    <label>
                        Answer:
                        <input type="text" name="answer" ref={(input) => {
                            this.textInput = input;
                        }} onChange={this.handleAnswer.bind(this)}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </section>
        )
    }
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {front: [], value: '', currQ: 0, answer: ''};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let card = this;
        let answer = this.state.value.trim().toLowerCase();
        fetch(`/cards/answers/${this.state.currQ}`)
            .then(res => res.json())
            .then(function (res) {
                console.log(res);
                if (res[0].toLowerCase() === answer) {
                    card.setState({answer: "Correct!"})
                } else {
                    card.setState({answer: "Incorrect! The answer was: " + res[0] + "."})
                }
                card.checkQuiz(res[1]);
            });
    }

    checkQuiz(num) {
        ReactDOM.findDOMNode(this.textInput).value = '';
        if (num !== 0) {
            this.setState({currQ: this.state.currQ + 1});
            this.getQuestion();
        } else {
            this.setState({front: "Quiz over!"});
        }
    }

    getQuestion() {
        fetch(`/cards/questions/${this.state.currQ}`)
            .then(res => res.json())
            .then(res => this.setState({front: res}));
    }

    componentDidMount() {
        this.getQuestion();
    }

    render() {
        return (
            <section>
                <div className="card">
                    <div>{this.state.front}</div>
                </div>
                {this.state.answer}
                <div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <label>
                            Answer:
                            <input type="text" name="answer" ref={(input) => {
                                this.textInput = input;
                            }} onChange={this.handleChange.bind(this)}/>
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
                <GenerateCard/>
            </section>
        )
    }
}

export default Card;
