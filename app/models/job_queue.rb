class JobQueue < ActiveRecord::Base
  validates :user_id, presence: true

  has_many :jobs
  belongs_to :user
end
