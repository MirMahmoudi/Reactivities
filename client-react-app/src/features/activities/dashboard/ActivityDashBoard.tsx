import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string)=> void;
    cancelActivity: ()=> void;
    editMode: boolean; 
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEditActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

function ActivityDashBoard(
    {activities, selectedActivity, selectActivity, cancelActivity,
        editMode, openForm, closeForm,
        createOrEditActivity, deleteActivity}
    :Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelActivity={cancelActivity}
                        openForm={openForm}
                    />
                }
                {editMode &&
                    <ActivityForm
                        activity={selectedActivity}
                        closeForm={closeForm}
                        createOrEditActivity={createOrEditActivity}
                    />
                }
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashBoard