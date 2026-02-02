import { Link } from 'react-router-dom';
import { 
  MessageSquarePlus, 
  Shield, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Users,
  BarChart3,
  Eye
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: MessageSquarePlus,
      title: 'Submit Your Feedback',
      description: 'Share your experience by filling out our simple feedback form. Rate your experience from 1-5 stars and add your comments.',
      color: 'primary-orange',
    },
    {
      number: '02',
      icon: Shield,
      title: 'Review & Moderation',
      description: 'Our team reviews all submissions to ensure authentic, helpful feedback. This helps maintain quality and trust.',
      color: 'primary-dark',
    },
    {
      number: '03',
      icon: Eye,
      title: 'Published Publicly',
      description: 'Once approved, your review becomes visible on our public reviews page, helping others make informed decisions.',
      color: 'primary-orange',
    },
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Build Trust',
      description: 'Authentic reviews help build credibility and trust with potential customers.',
    },
    {
      icon: Users,
      title: 'Help Others',
      description: 'Your feedback helps others make better, more informed decisions.',
    },
    {
      icon: BarChart3,
      title: 'Drive Improvement',
      description: 'Constructive feedback helps businesses identify areas for improvement.',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assured',
      description: 'All reviews are moderated to ensure authenticity and helpfulness.',
    },
  ];

  const faqs = [
    {
      question: 'How long does it take for my review to be published?',
      answer: 'Most reviews are reviewed within 24 hours. Once approved, your review will appear on the public reviews page immediately.',
    },
    {
      question: 'Can I submit a review anonymously?',
      answer: 'Yes! The name and email fields are optional. You can submit feedback without providing any personal information.',
    },
    {
      question: 'What happens if my review is not approved?',
      answer: 'Reviews may not be approved if they contain inappropriate content, spam, or violate our community guidelines. We focus on constructive, genuine feedback.',
    },
    {
      question: 'Can I edit or delete my review after submission?',
      answer: 'Currently, reviews cannot be edited after submission. If you need to make changes, please contact our support team.',
    },
  ];

  return (
    <div className="bg-neutral-offWhite">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-6">
            How RepuFeed Works
          </h1>
          <p className="text-xl text-neutral-slate max-w-3xl mx-auto">
            A simple, transparent process for collecting and sharing authentic customer feedback 
            that helps businesses grow and customers make informed decisions.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Three Simple Steps
            </h2>
            <p className="text-neutral-slate text-lg max-w-2xl mx-auto">
              From submission to publication, here's how your feedback journey works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-neutral-lightGray" />
                )}
                
                <div className="card text-center relative z-10">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-lightGray text-neutral-slate font-bold text-lg mb-6">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${step.color}/10 mb-6`}>
                    <step.icon className={`w-8 h-8 text-${step.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-slate">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Why Share Your Feedback?
            </h2>
            <p className="text-neutral-slate text-lg max-w-2xl mx-auto">
              Your voice matters. Here's how your feedback makes a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-orange/10 mb-4">
                  <benefit.icon className="w-7 h-7 text-primary-orange" />
                </div>
                <h3 className="text-lg font-semibold text-primary-dark mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-slate text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-slate text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-primary-dark mb-2">
                  {faq.question}
                </h3>
                <p className="text-neutral-slate">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Experience?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Your feedback helps businesses improve and helps other customers make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit-feedback"
              className="inline-flex items-center justify-center gap-2 bg-primary-orange text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
            >
              Submit Feedback
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/reviews"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-dark px-8 py-4 rounded-lg font-semibold hover:bg-neutral-offWhite transition-colors duration-200"
            >
              View Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
