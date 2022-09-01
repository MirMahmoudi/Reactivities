import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activitiesList = await agent.Activities.getDataList();
            runInAction(() => {
                this.activities = activitiesList.map(a => ( {...a, date: a.date.split('T')[0]} ));
                this.setLoadingInitial(false);
            })
        } catch (error) {
            console.log('Error', error);
            runInAction(() => {
                this.setLoadingInitial(false);
            })
        }
    }

    setLoadingInitial = (state: boolean) => this.loadingInitial = state;

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction( () => {
                this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log('Error', error)
            runInAction( () => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction( () => {
                this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.selectedActivity = activity;
                this.loading = false;
                this.editMode = false;
            })
        } catch (error) {
            console.log('Error', error);
            runInAction( () => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities = this.activities.filter(a => a.id !== id);
                this.selectedActivity?.id === id && this.cancelSelectedActivity();
                this.loading = false;
            })
        } catch (error) {
            console.log('Error', error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}