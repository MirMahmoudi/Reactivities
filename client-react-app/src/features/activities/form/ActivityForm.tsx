import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyDateInput from '../../../app/common/form/MyDateInput';

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
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required!'),
        description: Yup.string().required('The activity description is required!'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required!').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required()
    })

    useEffect(() => {
        if(id) loadActivity(id).then( activity => setActivity(activity!))
    },[id, loadActivity]);

    const handleFormSubmit = (activity: Activity) => {
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
            <Header content='Activity Details' sub color='teal'/>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>

                {({ handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='title' />
                        <MyTextArea rows={3} name='description' placeholder='Description'/>
                        <MySelectInput options={categoryOptions} name='category' placeholder='Category'/>
                        <MyDateInput
                            name='date'
                            placeholderText='Date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <MyTextInput name='city' placeholder='City'/>
                        <MyTextInput name='venue' placeholder='Venue'/>
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} positive floated='right'
                            type='submit' content='Submit'/>
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
}

export default observer(ActivityForm);