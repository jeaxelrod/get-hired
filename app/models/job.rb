class Job < ActiveRecord::Base
  validates :user_id, presence: true
  validates :link, url: true

  has_many :job_applications, dependent: :delete_all
  belongs_to :user
  belongs_to :job_queue
end
