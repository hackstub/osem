class EventSerializer < ActiveModel::Serializer
  include ActionView::Helpers::TextHelper

  attributes :guid, :title, :length, :scheduled_date, :language, :abstract, :abstract_html, :speaker_ids, :type, :room, :track

  def scheduled_date
    t = object.time
    t.blank? ? '' : %( #{I18n.l t, format: :short}#{t.formatted_offset(false)} )
  end

  def speaker_ids
    speakers = object.event_users.select { |i| i.event_role == 'speaker' }
    speakers.map { |i| i.user.id }
  end

  def type
    object.event_type.try(:title)
  end

  def room
    object.room.try(:guid)
  end

  def track
    object.track.try(:guid)
  end

  def length
    object.event_type.try(:length) || object.event_type.program.schedule_interval
  end

  def abstract_html
    options = {
      autolink: true,
      space_after_headers: true,
      no_intra_emphasis: true
    }
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(escape_html: true), options)
    markdown.render(object.abstract)
  end
end
