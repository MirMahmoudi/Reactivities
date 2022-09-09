import { useState } from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import axios from 'axios';
import ValidationErrors from "./ValidationErrors";
import { useHistory } from "react-router-dom";

function TestErrors() {
    const baseUrl = 'http://localhost:5000/api/';
    const [errors, setErrors] = useState(null);
    const history = useHistory();

    function handleNotFound() {
        setErrors(null)
        axios.get(baseUrl + 'buggy/not-found')
            .catch(err => history.push('/not-found'));
    }

    function handleBadRequest() {
        setErrors(null)
        axios.get(baseUrl + 'buggy/bad-request')
        .catch(err => console.log('err.response :>> ', err.response));
    }

    function handleServerError() {
        setErrors(null)
        axios.get(baseUrl + 'buggy/server-error')
            .catch(err => {
                setErrors(err.response.data)
                history.push('/server-error')
            });
    }

    function handleUnauthorized() {
        setErrors(null)
        axios.get(baseUrl + 'buggy/unauthorized')
            .catch(err => history.push('/not-found'));
    }

    function handleBadGuid() {
        setErrors(null)
        axios.get(baseUrl + 'activities/notaguid')
            .catch(err => {
                console.log('err[0]', err[0])
                history.push('/not-found');
            });
    }

    function handleValidationError() {
        setErrors(null)
        axios.post(baseUrl + 'activities', {})
            .catch(err => setErrors(err));
    }

    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='7'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorized} content='Unauthorized' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors &&
                <ValidationErrors errors={errors}/>
            }
        </>
    )
}

export default TestErrors