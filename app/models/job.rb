class Job < ActiveRecord::Base
  validates :user_id, presence: true

  has_many :job_applications
  belongs_to :user
  belongs_to :job_queue
end
