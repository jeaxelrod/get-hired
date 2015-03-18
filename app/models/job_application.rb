class JobApplication < ActiveRecord::Base
  validates :job_id,  presence: true
  validates :user_id, presence: true
  
  has_many :contacts
  belongs_to :job
  belongs_to :user
end
