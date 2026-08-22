from enum import Enum


class RecordStatus(str,Enum):
    active= "active"
    achived="archive"