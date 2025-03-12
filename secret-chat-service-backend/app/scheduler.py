from apscheduler.schedulers.background import BackgroundScheduler

class SchedulerSingleton:
    _scheduler = None

    @classmethod
    def get_scheduler(cls):
        if cls._scheduler is None:
            cls._scheduler = BackgroundScheduler()
        return cls._scheduler

scheduler = SchedulerSingleton.get_scheduler()
