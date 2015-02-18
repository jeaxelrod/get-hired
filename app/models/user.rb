class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  
  validates_confirmation_of :password

  has_many :jobs
  has_many :job_applications, through: :jobs
  has_many :job_queues
end
