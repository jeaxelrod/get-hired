class Contact < ActiveRecord::Base
  validates :email,   email: true
  validates :user_id, presence: true

  belongs_to :job_application
  belongs_to :user
  belongs_to :job
end
