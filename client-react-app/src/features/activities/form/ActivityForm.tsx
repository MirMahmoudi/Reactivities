import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

function ActivityForm() {

    const { activityStore } = useStore();
    const { loading, loadingInitial, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(id) loadActivity(id).then( activity => setActivity(activity!))
    },[id, loadActivity]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setActivity({...activity, [name]: value});
    }

    const handleSubmit = () => {
        // activity.id ? updateActivity(activity) : createActivity(activity);
        if(activity.id.length === 0){
            let newActivity = { ...activity, id: uuid()};
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    if(loadingInitial) return <LoadingComponent content='Loading activity ...'/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input onChange={handleInputChange} value={activity.title} name='title' placeholder='Title'/>
                <Form.TextArea onChange={handleInputChange} value={activity.description} name='description' placeholder='Description'/>
                <Form.Input onChange={handleInputChange} value={activity.category} name='category' placeholder='Category'/>
                <Form.Input onChange={handleInputChange} value={activity.date} type='date' name='date' placeholder='Date'/>
                <Form.Input onChange={handleInputChange} value={activity.city} name='city' placeholder='City'/>
                <Form.Input onChange={handleInputChange} value={activity.venue} name='venue' placeholder='Venue'/>
                <Button loading={loading} positive floated='right' type='submit' content='Submit'/>
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);