import React, { Component } from "react";
import "./TermComments.css";
import Auth from "../../utils/Auth";
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

class TermComments extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            comment: '',
            user: {},
            update: false,
            commentEdit: ''
        }

        this.updateComment = this.updateComment.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    
    componentDidMount() {
        
        if(Auth.isUserAuthenticated()) {
            const username = localStorage.getItem('username')
            axios.get(`/user/${username}`)
                .then(res => {
                    this.setState({ user: res.data[0]})
                })
                .catch(err => console.log(err))
        }
        
    }

    
    

    onSubmit(event) {
        event.preventDefault();
        const postRoute = '/newComment/' + this.props.id
        

        axios.post(postRoute, ({
            body: this.state.comment,
            author: this.state.user._id,
            authorName: this.state.user.username
        })).then(res => {
            console.log('Comment posted')
            this.setState({
                comment: ''
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleChange(event) {
        const { name, value } = event.target;

        this.setState({
            [name]: value
            });

        
    }

    deleteComment(id) {
        axios.delete('/newComment/' + id)
            .then(res => {
                console.log('Your comment has been deleted')
            })
            .catch(err => {
                console.log(err)
            })
    }

    updateComment(id, comment) {
        if(this.state.update === false) {
            this.setState({
                update: true,
                comment: comment,
                commentEdit: id
            })
        }
        if(this.state.update === true) {
            const postRoute = '/updateComment/' + id;
            axios.post(postRoute, ({
                body: this.state.comment
            }))
                .then(res => {
                    console.log('Your comment has been updated')
                    this.setState({
                        update: false
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    
    render() {
        return (
            <div className="termComments">
                {(this.props.comments).map(comment => {
                    
                    return (
                    <div key={comment._id}>
                        <div>{comment.authorName}</div>
                        <div>{moment(comment.createdAt).format('dddd-MMM-YYYY  HH:mm')}</div>
                        {this.state.update === true && this.state.commentEdit === comment._id ? <textarea onChange={this.handleChange.bind(this)} value={this.state.comment} name='comment'></textarea>
                        : <div style={{ whiteSpace:'pre-wrap', textAlign: 'left'}} >{comment.body}</div>}
                        <div>
                            {(this.state.update === false && this.state.user.username === comment.authorName) && <button onClick={() => this.updateComment(comment._id, comment.body)}>Update</button>}
                            {this.state.user.admin ? <button onClick={() => this.deleteComment(comment._id)}>Delete</button>
                            : this.state.user.username === comment.authorName && <button onClick={() => this.deleteComment(comment._id)}>Delete</button>
                        }
                            {(this.state.update === true && this.state.commentEdit === comment._id) && <button onClick={() => this.updateComment(comment._id, this.state.comment)}>Submit</button>}
                        </div>
                    </div>
                    )
                })}
                    <h4>FORM</h4>
                {Auth.isUserAuthenticated() ?
                    (<div>
                        <h2>Commenting as: {this.state.user.username}</h2>
                        <form onSubmit={this.onSubmit.bind(this)} >
                            <textarea style={{ width:'80%', height:'100px'}}name='comment' type='text' value={this.state.title} onChange={this.handleChange.bind(this)} />
                            <button type='submit'>Submit</button>
                        </form>
                    </div>) : (
                        <div><Link to='/login'>Log in</Link> or <Link to='/signup'>Sign up</Link> to post a comment!</div>
                    )
                }
            </div>
        )};

}
/*
 <div className="termComments">
            <h3>User Comments</h3>
            <button>Add a comment</button>
            <div className="commentContainer">
                <p>Sample comment 1 by a user</p>
                <p>Sample crazy comment 2 by a user</p>
            </div>
    </div>
*/
export default TermComments;