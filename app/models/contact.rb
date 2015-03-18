class Contact < ActiveRecord::Base
  belongs_to :job_application
  belongs_to :user
  belongs_to :job
end
