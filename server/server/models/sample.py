from . import db

class SampleModel(db.Model):
    __tablename__ = 'sample'

    id = db.Column(db.Integer, primary_key=True)
    record_name = db.Column(db.String(40))

    def toJSON(self):
        ret = {
            'id': self.id,
            'record': self.record_name
        }
        return ret

    @staticmethod
    def get_all():
        records = SampleModel.query.all()
        return records

    @staticmethod
    def add_record(record_name):
        new_sample = SampleModel(record_name=record_name)
        db.session.add(new_sample)
        try:
            db.session.commit()
            return new_sample
        except Exception, e:
            print e
            db.session.rollback()
            return new_sample
