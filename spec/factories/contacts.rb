FactoryGirl.define do
  factory :contact do
    first_name "First name"
    last_name "Last name"
    email "email@a.com"
    phone_number 1234567890

    job_application
    before(:create) do |contact|
      contact.user = contact.job_application.user
      contact.job = contact.job_application.job
    end
  end
end
