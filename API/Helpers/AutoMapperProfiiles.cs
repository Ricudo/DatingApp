using API.Entities;
using API.DTOs;
using AutoMapper;
using API.Extensions;

namespace API.Helpers
{
    public class AutoMapperProfiiles : Profile
    {
        public AutoMapperProfiiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdatesDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
        }
    }
}