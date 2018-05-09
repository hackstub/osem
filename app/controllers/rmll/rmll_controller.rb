module Rmll
    class RmllController < ActionController::Base
        layout "rmll"

        def static_pages
          if params[:page].nil?
            render "rmll/#{params[:heading]}"
          elsif params[:sub].nil?
            render "rmll/#{params[:heading]}/#{params[:page]}"
          else
            render "rmll/#{params[:heading]}/#{params[:page]}/#{params[:sub]}"
          end
        end
    end
end
