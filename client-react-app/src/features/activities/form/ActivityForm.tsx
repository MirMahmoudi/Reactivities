import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props{
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEditActivity: (activity: Activity) => void;
    submitting: boolean;
}

function ActivityForm({activity: selectedActivity, submitting, closeForm, createOrEditActivity}: Props) {
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    }

    const [activity, setActivity] = useState(initialState);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setActivity({...activity, [name]: value});
    }

    const handleSubmit = () => {
        createOrEditActivity(activity);
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input onChange={handleInputChange} value={activity.title} name='title' placeholder='Title'/>
                <Form.TextArea onChange={handleInputChange} value={activity.description} name='description' placeholder='Description'/>
                <Form.Input onChange={handleInputChange} value={activity.category} name='category' placeholder='Category'/>
                <Form.Input onChange={handleInputChange} value={activity.date} type='date' name='date' placeholder='Date'/>
                <Form.Input onChange={handleInputChange} value={activity.city} name='city' placeholder='City'/>
                <Form.Input onChange={handleInputChange} value={activity.venue} name='venue' placeholder='Venue'/>
                <Button loading={submitting} positive floated='right' type='submit' content='Submit'/>
                <Button onClick={closeForm} floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
}

export default ActivityForm